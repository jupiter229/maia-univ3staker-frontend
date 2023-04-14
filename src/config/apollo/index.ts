export * from "./graphql";
export * from "./graphql-uniswap";

// Export default client
import { uniswapClient } from "./graphql-uniswap";
export const apolloClient = uniswapClient;
