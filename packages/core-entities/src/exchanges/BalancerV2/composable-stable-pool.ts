import {
  BalancerBoostedPool,
  BalancerBoostedPoolABI,
  BalancerVault,
  BalancerVaultABI,
} from '@notional-finance/contracts';
import { AggregateCall } from '@notional-finance/multicall';
import { Network } from '@notional-finance/util';
import { BigNumber, Contract } from 'ethers';
import { TokenBalance } from '../..';
import BaseLiquidityPool from '../base-liquidity-pool';
import FixedPoint from './fixed-point';

export interface ComposableStablePoolParams {
  bptIndex: number;
  ampParam: FixedPoint;
  swapFeePercentage: FixedPoint;
  scalingFactors: FixedPoint[];
  poolId: string;
}

export class ComposableStablePool extends BaseLiquidityPool<ComposableStablePoolParams> {
  constructor(
    protected override _network: Network,
    protected override _balances: TokenBalance[],
    protected override _totalSupply: TokenBalance,
    public override poolParams: ComposableStablePoolParams
  ) {
    super(_network, _balances, _totalSupply, poolParams);
  }

  protected getScaledBalances(
    amounts: TokenBalance[] = this.balances
  ): FixedPoint[] {
    return amounts
      .map(FixedPoint.convert)
      .map((b, i) => b.mulDown(this.poolParams.scalingFactors[i]));
  }

  public getLPTokensGivenTokens(tokensIn: TokenBalance[]) {
    const balances = this.getScaledBalances();
    const invariant = this.calculateInvariant(
      this.poolParams.ampParam,
      balances
    );

    const amountsIn = this.getScaledBalances(tokensIn);

    const feesPaid = this.getDueProtocolFeeAmounts(
      this.poolParams.ampParam,
      invariant,
      balances,
      this.poolParams.swapFeePercentage
    );
    const balancesWithoutFees = balances.map((b, i) => b.sub(feesPaid[i]));

    const lpTokens = this.calcBptOutGivenExactTokensIn(
      this.poolParams.ampParam,
      balancesWithoutFees,
      amountsIn,
      FixedPoint.convert(this.totalSupply),
      this.poolParams.swapFeePercentage,
      invariant
    ).convertTo(this.totalSupply, FixedPoint.ONE);

    const lpClaims = this.getLPTokenClaims(
      lpTokens,
      balancesWithoutFees.map((b, i) =>
        b.convertTo(this.balances[i], this.poolParams.scalingFactors[i])
      ),
      this.totalSupply.add(lpTokens)
    );

    return {
      lpTokens,
      feesPaid: feesPaid.map((f, i) =>
        f.convertTo(this.balances[i], this.poolParams.scalingFactors[i])
      ),
      lpClaims,
    };
  }

  public getTokensOutGivenLPTokens(
    lpTokens: TokenBalance,
    singleSidedExitTokenIndex?: number
  ): {
    tokensOut: TokenBalance[];
    feesPaid: TokenBalance[];
  } {
    if (singleSidedExitTokenIndex !== undefined) {
      const balances = this.getScaledBalances();
      const invariant = this.calculateInvariant(
        this.poolParams.ampParam,
        balances
      );

      const { amountOut, feePaid } = this.calcTokenOutGivenExactBptIn(
        this.poolParams.ampParam,
        balances,
        singleSidedExitTokenIndex,
        FixedPoint.convert(lpTokens),
        FixedPoint.convert(this.totalSupply),
        this.poolParams.swapFeePercentage,
        invariant
      );

      const tokensOut = this.zeroTokenArray();
      const feesPaid = this.zeroTokenArray();

      tokensOut[singleSidedExitTokenIndex] = amountOut.convertTo(
        tokensOut[singleSidedExitTokenIndex],
        this.poolParams.scalingFactors[singleSidedExitTokenIndex]
      );
      feesPaid[singleSidedExitTokenIndex] = feePaid.convertTo(
        feesPaid[singleSidedExitTokenIndex],
        this.poolParams.scalingFactors[singleSidedExitTokenIndex]
      );

      return {
        tokensOut,
        feesPaid,
      };
    } else {
      return {
        tokensOut: this.getLPTokenClaims(lpTokens),
        feesPaid: this.zeroTokenArray(),
      };
    }
  }

  public calculateTokenTrade(
    tokensIn: TokenBalance,
    tokenIndexOut: number,
    balanceOverrides?: TokenBalance[]
  ): {
    tokensOut: TokenBalance;
    feesPaid: TokenBalance[];
  } {
    const tokenIndexIn = this.getTokenIndex(tokensIn.token);
    const balances = this.getScaledBalances(balanceOverrides);

    const invariant = this.calculateInvariant(
      this.poolParams.ampParam,
      balances
    );

    const scaledTokensIn = FixedPoint.convert(tokensIn).mulUp(
      this.poolParams.scalingFactors[tokenIndexIn]
    );

    let tokensOut = this.calcOutGivenIn(
      this.poolParams.ampParam,
      balances,
      tokenIndexIn,
      tokenIndexOut,
      scaledTokensIn,
      invariant
    );

    const feesPaid = this.zeroTokenArray();
    const tokenOutFeePaid = tokensOut.mulUp(this.poolParams.swapFeePercentage);
    feesPaid[tokenIndexOut] = tokenOutFeePaid.convertTo(
      this.balances[tokenIndexOut],
      this.poolParams.scalingFactors[tokenIndexOut]
    );
    tokensOut = tokensOut.sub(tokenOutFeePaid);

    return {
      tokensOut: tokensOut.convertTo(
        this.balances[tokenIndexOut],
        this.poolParams.scalingFactors[tokenIndexOut]
      ),
      feesPaid,
    };
  }

  /*********************************************************************/
  /*                      Balancer Stable Math                         */
  /*********************************************************************/
  private _AMP_PRECISION = FixedPoint.from(1e3);

  private calculateInvariant(ampParam: FixedPoint, balances: FixedPoint[]) {
    const numTokens = FixedPoint.from(balances.length);
    const sum = balances.reduce((s, b) => s.add(b), FixedPoint.from(0));
    if (sum.isZero()) return sum;

    let prevInvariant = FixedPoint.from(0);
    let invariant = sum;
    const ampTimesTotal = ampParam.mul(numTokens);

    for (let i = 0; i < 255; i += 1) {
      let D_P = FixedPoint.from(invariant.n);

      for (let j = 0; j < balances.length; j += 1) {
        // (D_P * invariant) / (balances[j] * numTokens)
        D_P = D_P.mul(invariant).divNoScale(balances[j].mul(numTokens));
      }

      prevInvariant = FixedPoint.from(invariant.n);
      // invariant * [(ampTimesTotal * sum) / AMP_PRECISION + D_P * numTokens]
      // prettier-ignore
      const invariantNum = invariant.mul(
        ampTimesTotal.mul(sum).divNoScale(this._AMP_PRECISION).add(D_P.mul(numTokens))
      )

      // ((ampTimesTotal - _AMP_PRECISION) * invariant) / _AMP_PRECISION + (numTokens + 1) * D_P
      // prettier-ignore
      const invariantDenom = (ampTimesTotal.sub(this._AMP_PRECISION)).mul(invariant)
        .divNoScale(this._AMP_PRECISION).add(numTokens.add(FixedPoint._1).mul(D_P))

      invariant = invariantNum.divNoScale(invariantDenom);

      if (invariant.gt(prevInvariant)) {
        if (invariant.sub(prevInvariant).lte(FixedPoint._1)) {
          return invariant;
        }
      } else if (prevInvariant.sub(invariant).lte(FixedPoint._1)) {
        return invariant;
      }
    }

    throw Error('Did not converge');
  }

  private _getTokenBalanceGivenInvariantAndAllOtherBalances(
    ampParam: FixedPoint,
    balances: FixedPoint[],
    invariant: FixedPoint,
    tokenIndex: number
  ) {
    const balancesLength = FixedPoint.from(balances.length);
    const ampTimesTotal = ampParam.mul(balancesLength);
    let sum = balances.reduce((s, b) => s.add(b), FixedPoint.from(0));

    let P_D = balances[0].mul(balancesLength);
    for (let j = 1; j < balances.length; j += 1) {
      P_D = P_D.mul(balances[j])
        .mul(balancesLength)
        .divNoScale(invariant, false);
    }

    sum = sum.sub(balances[tokenIndex]);

    const inv2 = invariant.mul(invariant);
    const c = inv2
      .divNoScale(ampTimesTotal.mul(P_D), true)
      .mul(this._AMP_PRECISION)
      .mul(balances[tokenIndex]);
    const b = sum.add(
      invariant.divNoScale(ampTimesTotal, false).mul(this._AMP_PRECISION)
    );

    let prevTokenBalance = FixedPoint.from(0);
    let tokenBalance = inv2.add(c).divNoScale(invariant.add(b), true);

    for (let i = 0; i < 255; i += 1) {
      prevTokenBalance = tokenBalance;
      // prettier-ignore
      tokenBalance = tokenBalance.mul(tokenBalance).add(c).divNoScale(
        tokenBalance.mul(FixedPoint.from(2)).add(b).sub(invariant),
        true
      )

      if (tokenBalance.gt(prevTokenBalance)) {
        if (tokenBalance.sub(prevTokenBalance).lte(FixedPoint.from(1))) {
          return tokenBalance;
        }
      } else if (prevTokenBalance.sub(tokenBalance).lte(FixedPoint.from(1))) {
        return tokenBalance;
      }
    }

    throw Error('Did not converge');
  }

  private calcTokenOutGivenExactBptIn(
    amp: FixedPoint,
    balances: FixedPoint[],
    tokenIndex: number,
    bptAmountIn: FixedPoint,
    bptTotalSupply: FixedPoint,
    swapFeePercentage: FixedPoint,
    currentInvariant: FixedPoint
  ) {
    const newInvariant = bptTotalSupply
      .sub(bptAmountIn)
      .divUp(bptTotalSupply)
      .mulUp(currentInvariant);
    const newBalanceTokenIndex =
      this._getTokenBalanceGivenInvariantAndAllOtherBalances(
        amp,
        balances,
        newInvariant,
        tokenIndex
      );
    const amountOutWithoutFee = balances[tokenIndex].sub(newBalanceTokenIndex);
    const sumBalances = balances.reduce((s, b) => s.add(b), FixedPoint.from(0));

    // Excess balance being withdrawn as a result of virtual swaps, requires swap fees
    const currentWeight = balances[tokenIndex].divDown(sumBalances);
    const taxablePercentage = currentWeight.complement();

    // Fees rounded up and applied to token out
    const taxableAmount = amountOutWithoutFee.mulUp(taxablePercentage);
    const nonTaxableAmount = amountOutWithoutFee.sub(taxableAmount);
    const amountOut = nonTaxableAmount.add(
      taxableAmount.mulDown(FixedPoint.ONE.sub(swapFeePercentage))
    );
    const feePaid = amountOutWithoutFee.sub(amountOut);

    return { amountOut, feePaid };
  }

  private calcBptOutGivenExactTokensIn(
    amp: FixedPoint,
    balances: FixedPoint[],
    amountsIn: FixedPoint[],
    bptTotalSupply: FixedPoint,
    swapFeePercentage: FixedPoint,
    currentInvariant: FixedPoint
  ) {
    const sumBalances = balances.reduce((s, b) => s.add(b), FixedPoint.from(0));

    let invariantRatioWithFees = FixedPoint.from(0);
    const balanceRatiosWithFee = balances.map((b, i) => {
      const currentWeight = b.divDown(sumBalances);
      const balanceRatioWithFee = b.add(amountsIn[i]).divDown(b);
      invariantRatioWithFees = invariantRatioWithFees.add(
        balanceRatioWithFee.mulDown(currentWeight)
      );
      return balanceRatioWithFee;
    });

    const newBalances = balances.map((b, i) => {
      let amountInWithoutFee: FixedPoint;
      if (balanceRatiosWithFee[i].gt(invariantRatioWithFees)) {
        const nonTaxableAmount = b.mulDown(
          invariantRatioWithFees.sub(FixedPoint.ONE)
        );
        const taxableAmount = amountsIn[i].sub(nonTaxableAmount);
        amountInWithoutFee = nonTaxableAmount.add(
          taxableAmount.mulDown(FixedPoint.ONE.sub(swapFeePercentage))
        );
      } else {
        amountInWithoutFee = amountsIn[i];
      }

      return b.add(amountInWithoutFee);
    });

    // Get current and new invariants given swap fees
    const newInvariant = this.calculateInvariant(amp, newBalances);
    const invariantRatio = newInvariant.divDown(currentInvariant);
    // Invariant must increase or we don't mint BPT
    if (invariantRatio.gt(FixedPoint.ONE)) {
      return bptTotalSupply.mulDown(invariantRatio.sub(FixedPoint.ONE));
    }
    return FixedPoint.from(0);
  }

  private calcOutGivenIn(
    ampParam: FixedPoint,
    balances: FixedPoint[],
    tokenIndexIn: number,
    tokenIndexOut: number,
    tokenAmountIn: FixedPoint,
    invariant: FixedPoint
  ) {
    const _balances = Array.from(balances);
    _balances[tokenIndexIn] = _balances[tokenIndexIn].add(tokenAmountIn);
    const finalBalanceOut =
      this._getTokenBalanceGivenInvariantAndAllOtherBalances(
        ampParam,
        _balances,
        invariant,
        tokenIndexOut
      );
    _balances[tokenIndexIn] = _balances[tokenIndexIn].sub(tokenAmountIn);
    return _balances[tokenIndexOut]
      .sub(finalBalanceOut)
      .sub(FixedPoint.from(1));
  }

  // The amplification parameter equals: A n^(n-1)
  private calcDueTokenProtocolSwapFeeAmount(
    amplificationParameter: FixedPoint,
    balances: FixedPoint[],
    lastInvariant: FixedPoint,
    tokenIndex: number,
    protocolSwapFeePercentage: FixedPoint
  ) {
    /** ************************************************************************************************************
      // oneTokenSwapFee - polynomial equation to solve                                                            //
      // af = fee amount to calculate in one token                                                                 //
      // bf = balance of fee token                                                                                 //
      // f = bf - af (finalBalanceFeeToken)                                                                        //
      // D = old invariant                                            D                     D^(n+1)                //
      // A = amplification coefficient               f^2 + ( S - ----------  - D) * f -  ------------- = 0         //
      // n = number of tokens                                    (A * n^n)               A * n^2n * P              //
      // S = sum of final balances but f                                                                           //
      // P = product of final balances but f                                                                       //
      ************************************************************************************************************* */

    // Protocol swap fee amount, so we round down overall.

    const finalBalanceFeeToken =
      this._getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplificationParameter,
        balances,
        lastInvariant,
        tokenIndex
      );

    if (balances[tokenIndex].lte(finalBalanceFeeToken)) {
      // This shouldn't happen outside of rounding errors, but have this safeguard nonetheless to prevent the Pool
      // from entering a locked state in which joins and exits revert while computing accumulated swap fees.
      return FixedPoint.from(0);
    }

    // Result is rounded down
    const accumulatedTokenSwapFees =
      balances[tokenIndex].sub(finalBalanceFeeToken);
    return accumulatedTokenSwapFees
      .mulDown(protocolSwapFeePercentage)
      .divDown(FixedPoint.ONE);
  }

  /**
   * @dev Returns the amount of protocol fees to pay, given the value of the last stored invariant and the current
   * balances.
   */
  private getDueProtocolFeeAmounts(
    ampParam: FixedPoint,
    invariant: FixedPoint,
    balances: FixedPoint[],
    protocolSwapFeePercentage: FixedPoint
  ) {
    // Initialize with zeros
    const numTokens = balances.length;
    const dueProtocolFeeAmounts = new Array<FixedPoint>(numTokens).fill(
      FixedPoint.from(0)
    );

    // Early return if the protocol swap fee percentage is zero, saving gas.
    if (protocolSwapFeePercentage.isZero()) {
      return dueProtocolFeeAmounts;
    }

    // Instead of paying the protocol swap fee in all tokens proportionally, we will pay it in a single one. This
    // will reduce gas costs for single asset joins and exits, as at most only two Pool balances will change (the
    // token joined/exited, and the token in which fees will be paid).

    // The protocol fee is charged using the token with the highest balance in the pool.
    let chosenTokenIndex = 0;
    let maxBalance = balances[0];
    for (let i = 1; i < numTokens; i += 1) {
      const currentBalance = balances[i];
      if (currentBalance.gt(maxBalance)) {
        chosenTokenIndex = i;
        maxBalance = currentBalance;
      }
    }

    // Set the fee amount to pay in the selected token
    dueProtocolFeeAmounts[chosenTokenIndex] =
      this.calcDueTokenProtocolSwapFeeAmount(
        ampParam,
        balances,
        invariant,
        chosenTokenIndex,
        protocolSwapFeePercentage
      );

    return dueProtocolFeeAmounts;
  }

  public static override getInitData(
    network: Network,
    poolAddress: string
  ): AggregateCall[] {
    const pool = new Contract(poolAddress, BalancerBoostedPoolABI);

    return [
      {
        stage: 0,
        target: pool,
        method: 'getSwapFeePercentage',
        key: 'swapFeePercentage',
        args: [],
        transform: (r: BigNumber) => FixedPoint.from(r),
      },
      // This is the actual "virtual" supply balance on the composable pool
      {
        stage: 0,
        target: pool,
        method: 'getActualSupply',
        key: 'totalSupply',
        args: [],
        transform: (r: BigNumber) =>
          TokenBalance.toJSON(r, poolAddress, network),
      },
      {
        stage: 0,
        target: pool,
        method: 'getPoolId',
        key: 'poolId',
      },
      {
        stage: 0,
        target: pool,
        method: 'getVault',
        key: 'vaultAddress',
      },
      {
        stage: 0,
        target: pool,
        method: 'getBptIndex',
        key: 'bptIndex',
      },
      {
        stage: 0,
        target: pool,
        method: 'getAmplificationParameter',
        key: 'ampParam',
        transform: (
          r: Awaited<
            ReturnType<
              BalancerBoostedPool['functions']['getAmplificationParameter']
            >
          >
        ) => FixedPoint.from(r.value),
      },
      {
        stage: 1,
        target: pool,
        method: 'getScalingFactors',
        key: 'scalingFactors',
        transform: (
          r: Awaited<
            ReturnType<BalancerBoostedPool['functions']['getScalingFactors']>
          >[0],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          aggregateResults: any
        ) =>
          r
            .filter((_, i) => i != aggregateResults[`${poolAddress}.bptIndex`])
            .map(FixedPoint.from),
      },
      {
        stage: 1,
        target: (r) =>
          new Contract(
            r[`${poolAddress}.vaultAddress`] as string,
            BalancerVaultABI
          ),
        method: 'getPoolTokens',
        args: (r) => [r[`${poolAddress}.poolId`]],
        key: 'balances',
        transform: (
          r: Awaited<ReturnType<BalancerVault['functions']['getPoolTokens']>>,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          aggregateResults: any
        ) => {
          const balances: unknown[] = [];
          for (let i = 0; i < r.balances.length; i++) {
            if (i != aggregateResults[`${poolAddress}.bptIndex`]) {
              balances.push(
                TokenBalance.toJSON(r.balances[i], r.tokens[i], network)
              );
            }
          }
          return balances;
        },
      },
    ];
  }
}
