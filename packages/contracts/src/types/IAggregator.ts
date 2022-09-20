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
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface IAggregatorInterface extends utils.Interface {
  functions: {
    "decimals()": FunctionFragment;
    "latestAnswer()": FunctionFragment;
    "latestRoundData()": FunctionFragment;
    "setAnswer(int256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "decimals"
      | "latestAnswer"
      | "latestRoundData"
      | "setAnswer"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "latestAnswer",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "latestRoundData",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setAnswer",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "latestAnswer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "latestRoundData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setAnswer", data: BytesLike): Result;

  events: {
    "AnswerUpdated(int256,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AnswerUpdated"): EventFragment;
}

export interface AnswerUpdatedEventObject {
  current: BigNumber;
  roundId: BigNumber;
  timestamp: BigNumber;
}
export type AnswerUpdatedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber],
  AnswerUpdatedEventObject
>;

export type AnswerUpdatedEventFilter = TypedEventFilter<AnswerUpdatedEvent>;

export interface IAggregator extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IAggregatorInterface;

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
    decimals(overrides?: CallOverrides): Promise<[number]>;

    latestAnswer(overrides?: CallOverrides): Promise<[BigNumber]>;

    latestRoundData(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        roundId: BigNumber;
        answer: BigNumber;
        startedAt: BigNumber;
        updatedAt: BigNumber;
        answeredInRound: BigNumber;
      }
    >;

    setAnswer(
      a: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  decimals(overrides?: CallOverrides): Promise<number>;

  latestAnswer(overrides?: CallOverrides): Promise<BigNumber>;

  latestRoundData(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
      roundId: BigNumber;
      answer: BigNumber;
      startedAt: BigNumber;
      updatedAt: BigNumber;
      answeredInRound: BigNumber;
    }
  >;

  setAnswer(
    a: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    decimals(overrides?: CallOverrides): Promise<number>;

    latestAnswer(overrides?: CallOverrides): Promise<BigNumber>;

    latestRoundData(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        roundId: BigNumber;
        answer: BigNumber;
        startedAt: BigNumber;
        updatedAt: BigNumber;
        answeredInRound: BigNumber;
      }
    >;

    setAnswer(
      a: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AnswerUpdated(int256,uint256,uint256)"(
      current?: PromiseOrValue<BigNumberish> | null,
      roundId?: PromiseOrValue<BigNumberish> | null,
      timestamp?: null
    ): AnswerUpdatedEventFilter;
    AnswerUpdated(
      current?: PromiseOrValue<BigNumberish> | null,
      roundId?: PromiseOrValue<BigNumberish> | null,
      timestamp?: null
    ): AnswerUpdatedEventFilter;
  };

  estimateGas: {
    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    latestAnswer(overrides?: CallOverrides): Promise<BigNumber>;

    latestRoundData(overrides?: CallOverrides): Promise<BigNumber>;

    setAnswer(
      a: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    latestAnswer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    latestRoundData(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setAnswer(
      a: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
