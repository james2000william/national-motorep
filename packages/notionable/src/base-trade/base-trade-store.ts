import {
  AccountDefinition,
  ConfigurationClient,
  TokenBalance,
  TokenDefinition,
} from '@notional-finance/core-entities';
import {
  AccountRiskProfile,
  RiskFactorKeys,
  RiskFactorLimit,
  VaultAccountRiskProfile,
} from '@notional-finance/risk-engine';
import {
  CalculationFn,
  CalculationFnParams,
  TransactionBuilder,
} from '@notional-finance/transaction';
import { PopulatedTransaction } from 'ethers';
import { VaultTradeConfiguration, VaultTradeType } from './vault-trade-config';
import { TradeType } from './trade-config';
export { TradeConfiguration } from './trade-config';
export { VaultTradeConfiguration } from './vault-trade-config';
export type { TradeType } from './trade-config';
export type { VaultTradeType } from './vault-trade-config';

export type FilterFunc = (
  t: TokenDefinition,
  a: AccountDefinition | null,
  s: BaseTradeState
) => boolean;

export interface TransactionConfig {
  readonly calculationFn: CalculationFn;
  readonly requiredArgs: CalculationFnParams[];
  readonly depositFilter?: FilterFunc;
  readonly collateralFilter?: FilterFunc;
  readonly debtFilter?: FilterFunc;
  readonly calculateDebtOptions?: boolean;
  readonly calculateCollateralOptions?: boolean;
  readonly transactionBuilder: TransactionBuilder;
}

/** Input amount directly from the frontend */
export interface InputAmount {
  amount: string;
  inUnderlying: boolean;
}

interface VaultState {
  vaultAddress?: string;
  vaultConfig?: ReturnType<ConfigurationClient['getVaultConfig']>;
}

export interface TokenOption {
  token: TokenDefinition;
  balance?: TokenBalance;
  interestRate?: number;
  error?: string;
}

/** Inputs set by the user interface, all of these are denominated in primitive values */
interface UserInputs {
  /** Set on load via a URL path parameter */
  underlying?: string;
  /** Symbol of the selected deposit token, if any */
  selectedDepositToken?: string;
  /** Symbol of the selected collateral token, if any */
  selectedCollateralToken?: string;
  /** Symbol of the selected debt token, if any */
  selectedDebtToken?: string;
  /** Input amount of any deposits, must be denominated in underlying */
  depositInputAmount?: InputAmount;
  /** Collateral input amount, can be denominated in underlying */
  collateralInputAmount?: InputAmount;
  /** Collateral input amount, can be denominated in underlying */
  debtInputAmount?: InputAmount;
  /** User selected risk factor */
  selectedRiskFactor?: RiskFactorKeys;
  /** User selected risk limit */
  selectedRiskLimit?: {
    value: number;
    symbol?: string;
  };
  /** User selected risk arg, used for liquidation prices */
  selectedRiskArgs?: {
    collateral: string;
    debt?: string;
  };
  redeemToWETH: boolean;
}

/** Calculated values based on token inputs */
interface TokenInputs {
  /** Collateral token definition */
  collateral?: TokenDefinition;
  /** Debt token definition */
  debt?: TokenDefinition;
  /** Deposit token definition, always in underlying */
  deposit?: TokenDefinition;

  /** Parsed from selected risk factors */
  riskFactorLimit?: RiskFactorLimit<RiskFactorKeys>;
  /** Calculated deposit balance, always in underlying */
  depositBalance?: TokenBalance;
  /** Calculated deposit balance, always in `collateral` token denomination */
  collateralBalance?: TokenBalance;
  /** Calculated deposit balance, always in `debt` token denomination */
  debtBalance?: TokenBalance;
  /** Calculated fee for creating collateral balance, always in prime cash token denomination */
  collateralFee?: TokenBalance;
  /** Calculated fee for creating debt balance, always in prime cash token denomination */
  debtFee?: TokenBalance;
  /** Error message from calculation */
  calculateError?: string;
  /** Alternative debt options given if all the inputs are satisfied */
  debtOptions?: TokenOption[];
  /** Alternative collateral options given if all the inputs are satisfied */
  collateralOptions?: TokenOption[];

  /** Default leverage ratio for the selected debt and collateral */
  defaultLeverageRatio?: number;
  /** Minimum allowed leverage ratio (only applies to vaults) */
  minLeverageRatio?: number;
  /** Maximum allowed leverage ratio */
  maxLeverageRatio?: number;
}

interface TransactionState {
  inputsSatisfied: boolean;
  /** True if the form is completed and able to be submitted */
  canSubmit: boolean;
  /** Contains a unique key for each set of calculation inputs */
  calculateInputKeys?: string;
  /** True if the form is in the confirmation state */
  confirm: boolean;
  /** Transaction call information for the confirmation page */
  populatedTransaction?: PopulatedTransaction;
  /** Error creating transaction */
  transactionError?: string;
}

interface InitState {
  /** True if the page is ready to be displayed */
  isReady: boolean;
  /** A list of tokens that can be deposited */
  availableDepositTokens?: TokenDefinition[];
  /** A list of collateral tokens that can be selected */
  availableCollateralTokens?: TokenDefinition[];
  /** A list of debt tokens that can be selected */
  availableDebtTokens?: TokenDefinition[];
  /** A key into the trade configuration object */
  tradeType?: TradeType | VaultTradeType;
}

export interface BaseTradeState
  extends Record<string, unknown>,
    InitState,
    UserInputs,
    TokenInputs,
    TransactionState,
    VaultState {}

export interface TradeState extends BaseTradeState {
  /** Account risk factors prior to any changes to the account */
  priorAccountRisk?: ReturnType<AccountRiskProfile['getAllRiskFactors']>;
  /** Account risk factors after changes applied to the account */
  postAccountRisk?: ReturnType<AccountRiskProfile['getAllRiskFactors']>;
}

export interface VaultTradeState extends BaseTradeState {
  /** Account risk factors prior to any changes to the account */
  priorAccountRisk?: ReturnType<VaultAccountRiskProfile['getAllRiskFactors']>;
  /** Account risk factors after changes applied to the account */
  postAccountRisk?: ReturnType<VaultAccountRiskProfile['getAllRiskFactors']>;
}

export const initialBaseTradeState: BaseTradeState = {
  isReady: false,
  hasError: false,
  canSubmit: false,
  confirm: false,
  inputsSatisfied: false,
  redeemToWETH: false,
};

export function isVaultTrade(tradeType?: VaultTradeType | TradeType) {
  if (!tradeType) return false;
  return Object.keys(VaultTradeConfiguration).includes(tradeType);
}
