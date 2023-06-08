/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment TokenFields on Token {\n  decimals\n  name\n  id\n  symbol\n  volume\n  volumeUSD\n  derivedETH\n}\n\nquery GetToken($id: ID!) {\n  token(id: $id) {\n    ...TokenFields\n  }\n}\n\nquery GetTokens($filter: Token_filter) {\n  tokens(where: $filter) {\n    ...TokenFields\n  }\n}\n\nfragment PoolFields on Pool {\n  id\n  token0 {\n    ...TokenFields\n  }\n  token1 {\n    ...TokenFields\n  }\n  totalValueLockedUSD\n  feeTier\n  liquidity\n  totalLiquidity\n  sqrtPrice\n  tick\n}\n\nquery GetPool($id: ID!) {\n  pool(id: $id) {\n    ...PoolFields\n  }\n}\n\nquery GetPools($filter: Pool_filter) {\n  pools(where: $filter) {\n    ...PoolFields\n  }\n}\n\nfragment TransactionFields on Transaction {\n  id\n  timestamp\n  blockNumber\n}\n\nfragment PositionFields on Position {\n  id\n  liquidity\n  tickUpper {\n    tickIdx\n  }\n  tickLower {\n    tickIdx\n  }\n  pool {\n    ...PoolFields\n  }\n  owner\n  depositedToken0\n  depositedToken1\n  transaction {\n    ...TransactionFields\n  }\n}\n\nquery GetPositions($where: Position_filter) {\n  positions(where: $where) {\n    ...PositionFields\n  }\n}\n\nquery GetPoolDayData($filter: PoolDayData_filter) {\n  poolDayDatas(where: $filter) {\n    ...PoolDayDataFields\n  }\n}\n\nfragment PoolDayDataFields on PoolDayData {\n  pool {\n    id\n  }\n  date\n  feesUSD\n}\n\nquery GetEthPrice($filter: Bundle_filter) {\n  bundles(where: $filter) {\n    ethPriceUSD\n  }\n}": types.TokenFieldsFragmentDoc,
    "fragment BaseIncentiveFields on Incentive {\n  id\n  pool\n  endTime\n  ended\n  minWidth\n  refundee\n  reward\n  rewardToken\n  startTime\n}\n\nfragment BasePositionFields on Position {\n  owner\n  staked\n  tokenId\n  oldOwner\n  id\n  liquidity\n  approved\n}\n\nfragment StakeFields on Stake {\n  id\n  position {\n    ...BasePositionFields\n  }\n  incentive {\n    ...BaseIncentiveFields\n  }\n}\n\nfragment IncentiveFields on Incentive {\n  ...BaseIncentiveFields\n  stakedPositions {\n    ...StakeFields\n  }\n}\n\nquery GetIncentive($id: ID!) {\n  incentive(id: $id) {\n    ...IncentiveFields\n  }\n}\n\nquery GetIncentives {\n  incentives {\n    ...IncentiveFields\n  }\n}\n\nfragment StakerPositionFields on Position {\n  ...BasePositionFields\n  stakedIncentives {\n    ...StakeFields\n  }\n}\n\nquery GetStakerPositions($where: Position_filter) {\n  positions(where: $where) {\n    ...StakerPositionFields\n  }\n}": types.BaseIncentiveFieldsFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment TokenFields on Token {\n  decimals\n  name\n  id\n  symbol\n  volume\n  volumeUSD\n  derivedETH\n}\n\nquery GetToken($id: ID!) {\n  token(id: $id) {\n    ...TokenFields\n  }\n}\n\nquery GetTokens($filter: Token_filter) {\n  tokens(where: $filter) {\n    ...TokenFields\n  }\n}\n\nfragment PoolFields on Pool {\n  id\n  token0 {\n    ...TokenFields\n  }\n  token1 {\n    ...TokenFields\n  }\n  totalValueLockedUSD\n  feeTier\n  liquidity\n  totalLiquidity\n  sqrtPrice\n  tick\n}\n\nquery GetPool($id: ID!) {\n  pool(id: $id) {\n    ...PoolFields\n  }\n}\n\nquery GetPools($filter: Pool_filter) {\n  pools(where: $filter) {\n    ...PoolFields\n  }\n}\n\nfragment TransactionFields on Transaction {\n  id\n  timestamp\n  blockNumber\n}\n\nfragment PositionFields on Position {\n  id\n  liquidity\n  tickUpper {\n    tickIdx\n  }\n  tickLower {\n    tickIdx\n  }\n  pool {\n    ...PoolFields\n  }\n  owner\n  depositedToken0\n  depositedToken1\n  transaction {\n    ...TransactionFields\n  }\n}\n\nquery GetPositions($where: Position_filter) {\n  positions(where: $where) {\n    ...PositionFields\n  }\n}\n\nquery GetPoolDayData($filter: PoolDayData_filter) {\n  poolDayDatas(where: $filter) {\n    ...PoolDayDataFields\n  }\n}\n\nfragment PoolDayDataFields on PoolDayData {\n  pool {\n    id\n  }\n  date\n  feesUSD\n}\n\nquery GetEthPrice($filter: Bundle_filter) {\n  bundles(where: $filter) {\n    ethPriceUSD\n  }\n}"): (typeof documents)["fragment TokenFields on Token {\n  decimals\n  name\n  id\n  symbol\n  volume\n  volumeUSD\n  derivedETH\n}\n\nquery GetToken($id: ID!) {\n  token(id: $id) {\n    ...TokenFields\n  }\n}\n\nquery GetTokens($filter: Token_filter) {\n  tokens(where: $filter) {\n    ...TokenFields\n  }\n}\n\nfragment PoolFields on Pool {\n  id\n  token0 {\n    ...TokenFields\n  }\n  token1 {\n    ...TokenFields\n  }\n  totalValueLockedUSD\n  feeTier\n  liquidity\n  totalLiquidity\n  sqrtPrice\n  tick\n}\n\nquery GetPool($id: ID!) {\n  pool(id: $id) {\n    ...PoolFields\n  }\n}\n\nquery GetPools($filter: Pool_filter) {\n  pools(where: $filter) {\n    ...PoolFields\n  }\n}\n\nfragment TransactionFields on Transaction {\n  id\n  timestamp\n  blockNumber\n}\n\nfragment PositionFields on Position {\n  id\n  liquidity\n  tickUpper {\n    tickIdx\n  }\n  tickLower {\n    tickIdx\n  }\n  pool {\n    ...PoolFields\n  }\n  owner\n  depositedToken0\n  depositedToken1\n  transaction {\n    ...TransactionFields\n  }\n}\n\nquery GetPositions($where: Position_filter) {\n  positions(where: $where) {\n    ...PositionFields\n  }\n}\n\nquery GetPoolDayData($filter: PoolDayData_filter) {\n  poolDayDatas(where: $filter) {\n    ...PoolDayDataFields\n  }\n}\n\nfragment PoolDayDataFields on PoolDayData {\n  pool {\n    id\n  }\n  date\n  feesUSD\n}\n\nquery GetEthPrice($filter: Bundle_filter) {\n  bundles(where: $filter) {\n    ethPriceUSD\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment BaseIncentiveFields on Incentive {\n  id\n  pool\n  endTime\n  ended\n  minWidth\n  refundee\n  reward\n  rewardToken\n  startTime\n}\n\nfragment BasePositionFields on Position {\n  owner\n  staked\n  tokenId\n  oldOwner\n  id\n  liquidity\n  approved\n}\n\nfragment StakeFields on Stake {\n  id\n  position {\n    ...BasePositionFields\n  }\n  incentive {\n    ...BaseIncentiveFields\n  }\n}\n\nfragment IncentiveFields on Incentive {\n  ...BaseIncentiveFields\n  stakedPositions {\n    ...StakeFields\n  }\n}\n\nquery GetIncentive($id: ID!) {\n  incentive(id: $id) {\n    ...IncentiveFields\n  }\n}\n\nquery GetIncentives {\n  incentives {\n    ...IncentiveFields\n  }\n}\n\nfragment StakerPositionFields on Position {\n  ...BasePositionFields\n  stakedIncentives {\n    ...StakeFields\n  }\n}\n\nquery GetStakerPositions($where: Position_filter) {\n  positions(where: $where) {\n    ...StakerPositionFields\n  }\n}"): (typeof documents)["fragment BaseIncentiveFields on Incentive {\n  id\n  pool\n  endTime\n  ended\n  minWidth\n  refundee\n  reward\n  rewardToken\n  startTime\n}\n\nfragment BasePositionFields on Position {\n  owner\n  staked\n  tokenId\n  oldOwner\n  id\n  liquidity\n  approved\n}\n\nfragment StakeFields on Stake {\n  id\n  position {\n    ...BasePositionFields\n  }\n  incentive {\n    ...BaseIncentiveFields\n  }\n}\n\nfragment IncentiveFields on Incentive {\n  ...BaseIncentiveFields\n  stakedPositions {\n    ...StakeFields\n  }\n}\n\nquery GetIncentive($id: ID!) {\n  incentive(id: $id) {\n    ...IncentiveFields\n  }\n}\n\nquery GetIncentives {\n  incentives {\n    ...IncentiveFields\n  }\n}\n\nfragment StakerPositionFields on Position {\n  ...BasePositionFields\n  stakedIncentives {\n    ...StakeFields\n  }\n}\n\nquery GetStakerPositions($where: Position_filter) {\n  positions(where: $where) {\n    ...StakerPositionFields\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;