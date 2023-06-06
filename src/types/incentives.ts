import {
    IncentiveFieldsFragment,
    PoolFieldsFragment,
    PositionFieldsFragment,
    StakerPositionFieldsFragment,
    TokenFieldsFragment,
} from "./graphql/graphql";
  
  export interface IncentivePool {
    id: string;
    feesUSD: number;
    feeTier: number;
  }
  
  export type IIncentive = Omit<
    IncentiveFieldsFragment,
    "pool" | "rewardToken"
  > & {
    pool: PoolFieldsFragment;
    rewardToken: TokenFieldsFragment;
  };
  
  export type IPosition = PositionFieldsFragment &
    StakerPositionFieldsFragment & {
      deposited: boolean;
      incentive?: IIncentive;
    };
  
  export type IStakedPosition = IPosition & {
    incentive: IIncentive;
  };
  
  export type Arrayable<T = any> = T[] | T;
  
  export type Incentiveish = IIncentive | IncentiveFieldsFragment;
  