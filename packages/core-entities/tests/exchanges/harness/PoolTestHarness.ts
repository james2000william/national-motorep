import { Network } from '../../../src';
import { BigNumber, Signer } from 'ethers';

export abstract class PoolTestHarness {
  public static async makePoolHarness(
    _network: Network,
    _poolAddress: string
  ): Promise<PoolTestHarness> {
    throw Error('Unimplemented');
  }

  public abstract singleSideEntry(
    signer: Signer,
    entryTokenIndex: number,
    entryTokenAmount: BigNumber
  ): Promise<{ lpTokens: BigNumber; feesPaid: BigNumber[] }>;

  public abstract singleSideExit(
    signer: Signer,
    exitTokenIndex: number,
    lpTokenAmount: BigNumber
  ): Promise<{ tokensOut: BigNumber; feesPaid: BigNumber[] }>;

  public abstract multiTokenEntry(
    signer: Signer,
    tokensIn: BigNumber[]
  ): Promise<{ lpTokens: BigNumber; feesPaid: BigNumber[] }>;

  public abstract multiTokenExit(
    signer: Signer,
    lpTokenAmount: BigNumber,
    minTokensOut?: BigNumber[]
  ): Promise<{ tokensOut: BigNumber[]; feesPaid: BigNumber[] }>;

  public abstract trade(
    signer: Signer,
    tokensIn: BigNumber,
    tokensInIndex: number,
    tokensOutIndex: number
  ): Promise<{ tokensOut: BigNumber; feesPaid: BigNumber[] }>;
}
