import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { goerli, mainnet } from "wagmi";

export enum ChainID {
  MAINNET = 1,
  GOERLI = 5,
}

export const CHAINS = [mainnet, goerli];

export type ChainProperty<T = any> = {
  [k in ChainID]: T;
};

export type Address = ChainProperty<string>;

export type ChainURL = ChainProperty<string>;

export type GraphQLClient = {
  [k in ChainID]: ApolloClient<NormalizedCacheObject>;
};
