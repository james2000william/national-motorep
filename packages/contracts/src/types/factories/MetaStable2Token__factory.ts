/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  MetaStable2Token,
  MetaStable2TokenInterface,
} from "../MetaStable2Token";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "totalBPTHeld",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bptThreshold",
        type: "uint256",
      },
    ],
    name: "BalancerPoolShareTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC20Error",
    type: "error",
  },
  {
    inputs: [],
    name: "HasNotMatured",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "lastSettlementTimestamp",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "coolDownInMinutes",
        type: "uint32",
      },
    ],
    name: "InSettlementCoolDown",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "InvalidPrimaryToken",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "InvalidSecondaryToken",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInSettlementWindow",
    type: "error",
  },
  {
    inputs: [],
    name: "PostMaturitySettlement",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "slippage",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "limit",
        type: "uint32",
      },
    ],
    name: "SlippageTooHigh",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "NOTIONAL",
    outputs: [
      {
        internalType: "contract NotionalProxy",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TRADING_MODULE",
    outputs: [
      {
        internalType: "contract ITradingModule",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimRewardTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "claimedBalances",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bptClaim",
        type: "uint256",
      },
    ],
    name: "convertBPTClaimToStrategyTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "strategyTokenAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "strategyTokenAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
    ],
    name: "convertStrategyToUnderlying",
    outputs: [
      {
        internalType: "int256",
        name: "underlyingValue",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "strategyTokenAmount",
        type: "uint256",
      },
    ],
    name: "convertStrategyTokensToBPTClaim",
    outputs: [
      {
        internalType: "uint256",
        name: "bptClaim",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deposit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "depositFromNotional",
    outputs: [
      {
        internalType: "uint256",
        name: "strategyTokensMinted",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getStrategyContext",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "primaryToken",
                type: "address",
              },
              {
                internalType: "address",
                name: "secondaryToken",
                type: "address",
              },
              {
                internalType: "uint8",
                name: "primaryIndex",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "secondaryIndex",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "primaryDecimals",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "secondaryDecimals",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "primaryBalance",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "secondaryBalance",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "contract IERC20",
                    name: "pool",
                    type: "address",
                  },
                  {
                    internalType: "bytes32",
                    name: "poolId",
                    type: "bytes32",
                  },
                ],
                internalType: "struct PoolContext",
                name: "basePool",
                type: "tuple",
              },
            ],
            internalType: "struct TwoTokenPoolContext",
            name: "poolContext",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "ampParam",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "oracleWindowInSeconds",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "balancerOracleWeight",
                    type: "uint256",
                  },
                ],
                internalType: "struct OracleContext",
                name: "baseOracle",
                type: "tuple",
              },
            ],
            internalType: "struct StableOracleContext",
            name: "oracleContext",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "contract ILiquidityGauge",
                name: "liquidityGauge",
                type: "address",
              },
              {
                internalType: "contract IAuraBooster",
                name: "auraBooster",
                type: "address",
              },
              {
                internalType: "contract IAuraRewardPool",
                name: "auraRewardPool",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "auraPoolId",
                type: "uint256",
              },
              {
                internalType: "contract IERC20[]",
                name: "rewardTokens",
                type: "address[]",
              },
            ],
            internalType: "struct AuraStakingContext",
            name: "stakingContext",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "totalBPTHeld",
                type: "uint256",
              },
              {
                internalType: "uint32",
                name: "settlementPeriodInSeconds",
                type: "uint32",
              },
              {
                internalType: "contract ITradingModule",
                name: "tradingModule",
                type: "address",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "maxUnderlyingSurplus",
                    type: "uint256",
                  },
                  {
                    internalType: "uint32",
                    name: "oracleWindowInSeconds",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "settlementSlippageLimitPercent",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "postMaturitySettlementSlippageLimitPercent",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "emergencySettlementSlippageLimitPercent",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "maxRewardTradeSlippageLimitPercent",
                    type: "uint32",
                  },
                  {
                    internalType: "uint16",
                    name: "maxBalancerPoolShare",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "balancerOracleWeight",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "settlementCoolDownInMinutes",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "feePercentage",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "oraclePriceDeviationLimitPercent",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "balancerPoolSlippageLimitPercent",
                    type: "uint16",
                  },
                ],
                internalType: "struct StrategyVaultSettings",
                name: "vaultSettings",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "uint80",
                    name: "totalStrategyTokenGlobal",
                    type: "uint80",
                  },
                  {
                    internalType: "uint32",
                    name: "lastSettlementTimestamp",
                    type: "uint32",
                  },
                ],
                internalType: "struct StrategyVaultState",
                name: "vaultState",
                type: "tuple",
              },
              {
                internalType: "address",
                name: "feeReceiver",
                type: "address",
              },
            ],
            internalType: "struct StrategyContext",
            name: "baseStrategy",
            type: "tuple",
          },
        ],
        internalType: "struct MetaStable2TokenAuraStrategyContext",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint16",
            name: "borrowCurrencyId",
            type: "uint16",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "maxUnderlyingSurplus",
                type: "uint256",
              },
              {
                internalType: "uint32",
                name: "oracleWindowInSeconds",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "settlementSlippageLimitPercent",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "postMaturitySettlementSlippageLimitPercent",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "emergencySettlementSlippageLimitPercent",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "maxRewardTradeSlippageLimitPercent",
                type: "uint32",
              },
              {
                internalType: "uint16",
                name: "maxBalancerPoolShare",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "balancerOracleWeight",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "settlementCoolDownInMinutes",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "feePercentage",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "oraclePriceDeviationLimitPercent",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "balancerPoolSlippageLimitPercent",
                type: "uint16",
              },
            ],
            internalType: "struct StrategyVaultSettings",
            name: "settings",
            type: "tuple",
          },
        ],
        internalType: "struct InitParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "strategyTokens",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "underlyingToRepayDebt",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "redeemFromNotional",
    outputs: [
      {
        internalType: "uint256",
        name: "transferToReceiver",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "tradeData",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "minBPT",
            type: "uint256",
          },
        ],
        internalType: "struct ReinvestRewardParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "reinvestReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "underlyingRequired",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "repaySecondaryBorrowCallback",
    outputs: [
      {
        internalType: "bytes",
        name: "returnData",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "maxUnderlyingSurplus",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "oracleWindowInSeconds",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "settlementSlippageLimitPercent",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "postMaturitySettlementSlippageLimitPercent",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "emergencySettlementSlippageLimitPercent",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "maxRewardTradeSlippageLimitPercent",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxBalancerPoolShare",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "balancerOracleWeight",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "settlementCoolDownInMinutes",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "feePercentage",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "oraclePriceDeviationLimitPercent",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "balancerPoolSlippageLimitPercent",
            type: "uint16",
          },
        ],
        internalType: "struct StrategyVaultSettings",
        name: "settings",
        type: "tuple",
      },
    ],
    name: "setStrategyVaultSettings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "settleVaultEmergency",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "strategyTokensToRedeem",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "settleVaultNormal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "strategyTokensToRedeem",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "settleVaultPostMaturity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "strategy",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

export class MetaStable2Token__factory {
  static readonly abi = _abi;
  static createInterface(): MetaStable2TokenInterface {
    return new utils.Interface(_abi) as MetaStable2TokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MetaStable2Token {
    return new Contract(address, _abi, signerOrProvider) as MetaStable2Token;
  }
}
