import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { metis } from "@wagmi/chains";

export enum ChainID {
  METIS = 1088,
  GOERLI = 5,
}

export const CHAINS = [metis];

export type ChainProperty<T = any> = {
  [k in ChainID]: T;
};

export type Address = ChainProperty<string>;

export type ChainURL = ChainProperty<string>;

export type GraphQLClient = {
  [k in ChainID]: ApolloClient<NormalizedCacheObject>;
};
