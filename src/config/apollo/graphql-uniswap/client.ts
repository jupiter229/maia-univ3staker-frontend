import { UNISWAP_SUBGRAPH_URL } from "@/config/constants";
import { ChainID, GraphQLClient } from "@/types";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const uniswapClient: GraphQLClient = {
  [ChainID.MAINNET]: new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: UNISWAP_SUBGRAPH_URL[ChainID.MAINNET],
    }),
  }),
  [ChainID.GOERLI]: new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: UNISWAP_SUBGRAPH_URL[ChainID.GOERLI],
    }),
  }),
};

export default uniswapClient;
