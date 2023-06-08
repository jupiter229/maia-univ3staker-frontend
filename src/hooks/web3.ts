import {
  DEFAULT_CHAIN,
  DEFAULT_CHAIN_ID,
  apolloClient,
  graphqlClient,
} from "@/config";
import { Address, ChainID, ChainProperty } from "@/types";
import {
  useAccount,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from "wagmi";

export const useChain = () => {
  const { chain = DEFAULT_CHAIN } = useNetwork();
  return chain;
};

export const useChainID = () => {
  const chain = useChain();
  const chainId: ChainID = chain?.id ?? DEFAULT_CHAIN_ID;
  return chainId;
};

export const useChainProperty = <T = any>(obj?: ChainProperty<T>) => {
  const chainId = useChainID();
  return obj?.[chainId] ?? obj?.[DEFAULT_CHAIN_ID];
};

export const useWeb3 = () => {
  const account = useAccount();
  const network = useNetwork();
  const chain = useChain();
  const chainId = useChainID();

  return {
    ...network,
    ...account,
    chain,
    chainId,
    account: account?.address,
  };
};

export const useUniswapClient = () => {
  return useChainProperty(apolloClient)!;
};

export const useGraphClient = () => {
  return useChainProperty(graphqlClient)!;
};

export const useAddress = (addr?: Address | string) => {
  const isString = typeof addr === "string";
  const chainProperty = useChainProperty(isString ? undefined : addr);
  return isString ? addr : chainProperty;
};

export const useSignerOrProvider = () => {
  const signer = usePublicClient();
  const provider = useWalletClient();
  return signer ?? provider;
};
