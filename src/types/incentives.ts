import {
  IncentiveFieldsFragment,
  PoolFieldsFragment,
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
