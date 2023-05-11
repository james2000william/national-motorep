/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface IStrategyVaultInterface extends utils.Interface {
  functions: {
    "convertStrategyToUnderlying(address,uint256,uint256)": FunctionFragment;
    "decimals()": FunctionFragment;
    "depositFromNotional(address,uint256,uint256,bytes)": FunctionFragment;
    "name()": FunctionFragment;
    "redeemFromNotional(address,address,uint256,uint256,uint256,bytes)": FunctionFragment;
    "repaySecondaryBorrowCallback(address,uint256,bytes)": FunctionFragment;
    "strategy()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "convertStrategyToUnderlying"
      | "decimals"
      | "depositFromNotional"
      | "name"
      | "redeemFromNotional"
      | "repaySecondaryBorrowCallback"
      | "strategy"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "convertStrategyToUnderlying",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "depositFromNotional",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "redeemFromNotional",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "repaySecondaryBorrowCallback",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(functionFragment: "strategy", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "convertStrategyToUnderlying",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositFromNotional",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "redeemFromNotional",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "repaySecondaryBorrowCallback",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "strategy", data: BytesLike): Result;

  events: {};
}

export interface IStrategyVault extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IStrategyVaultInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    convertStrategyToUnderlying(
      account: PromiseOrValue<string>,
      strategyTokens: PromiseOrValue<BigNumberish>,
      maturity: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { underlyingValue: BigNumber }>;

    decimals(overrides?: CallOverrides): Promise<[number]>;

    depositFromNotional(
      account: PromiseOrValue<string>,
      depositAmount: PromiseOrValue<BigNumberish>,
      maturity: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    name(overrides?: CallOverrides): Promise<[string]>;

    redeemFromNotional(
      account: PromiseOrValue<string>,
      receiver: PromiseOrValue<string>,
      strategyTokens: PromiseOrValue<BigNumberish>,
      maturity: PromiseOrValue<BigNumberish>,
      underlyingToRepayDebt: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    repaySecondaryBorrowCallback(
      token: PromiseOrValue<string>,
      underlyingRequired: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    strategy(
      overrides?: CallOverrides
    ): Promise<[string] & { strategyId: string }>;
  };

  convertStrategyToUnderlying(
    account: PromiseOrValue<string>,
    strategyTokens: PromiseOrValue<BigNumberish>,
    maturity: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  decimals(overrides?: CallOverrides): Promise<number>;

  depositFromNotional(
    account: PromiseOrValue<string>,
    depositAmount: PromiseOrValue<BigNumberish>,
    maturity: PromiseOrValue<BigNumberish>,
    data: PromiseOrValue<BytesLike>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  name(overrides?: CallOverrides): Promise<string>;

  redeemFromNotional(
    account: PromiseOrValue<string>,
    receiver: PromiseOrValue<string>,
    strategyTokens: PromiseOrValue<BigNumberish>,
    maturity: PromiseOrValue<BigNumberish>,
    underlyingToRepayDebt: PromiseOrValue<BigNumberish>,
    data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  repaySecondaryBorrowCallback(
    token: PromiseOrValue<string>,
    underlyingRequired: PromiseOrValue<BigNumberish>,
    data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  strategy(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    convertStrategyToUnderlying(
      account: PromiseOrValue<string>,
      strategyTokens: PromiseOrValue<BigNumberish>,
      maturity: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<number>;

    depositFromNotional(
      account: PromiseOrValue<string>,
      depositAmount: PromiseOrValue<BigNumberish>,
      maturity: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<string>;

    redeemFromNotional(
      account: PromiseOrValue<string>,
      receiver: PromiseOrValue<string>,
      strategyTokens: PromiseOrValue<BigNumberish>,
      maturity: PromiseOrValue<BigNumberish>,
      underlyingToRepayDebt: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    repaySecondaryBorrowCallback(
      token: PromiseOrValue<string>,
      underlyingRequired: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    strategy(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    convertStrategyToUnderlying(
      account: PromiseOrValue<string>,
      strategyTokens: PromiseOrValue<BigNumberish>,
      maturity: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    depositFromNotional(
      account: PromiseOrValue<string>,
      depositAmount: PromiseOrValue<BigNumberish>,
      maturity: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    redeemFromNotional(
      account: PromiseOrValue<string>,
      receiver: PromiseOrValue<string>,
      strategyTokens: PromiseOrValue<BigNumberish>,
      maturity: PromiseOrValue<BigNumberish>,
      underlyingToRepayDebt: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    repaySecondaryBorrowCallback(
      token: PromiseOrValue<string>,
      underlyingRequired: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    strategy(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    convertStrategyToUnderlying(
      account: PromiseOrValue<string>,
      strategyTokens: PromiseOrValue<BigNumberish>,
      maturity: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    depositFromNotional(
      account: PromiseOrValue<string>,
      depositAmount: PromiseOrValue<BigNumberish>,
      maturity: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    redeemFromNotional(
      account: PromiseOrValue<string>,
      receiver: PromiseOrValue<string>,
      strategyTokens: PromiseOrValue<BigNumberish>,
      maturity: PromiseOrValue<BigNumberish>,
      underlyingToRepayDebt: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    repaySecondaryBorrowCallback(
      token: PromiseOrValue<string>,
      underlyingRequired: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    strategy(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}