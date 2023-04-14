import { DEFAULT_CHAIN_ID, apolloClient, graphqlClient } from "@/config";
import { Address, ChainID, ChainProperty } from "@/types";
import {
  useAccount,
  useContract,
  useNetwork,
  useProvider,
  useSigner,
} from "wagmi";

export const useChain = () => {
  const { chain } = useNetwork();
  return chain;
};

export const useChainID = () => {
  const chain = useChain();
  const chainId: ChainID = chain?.id ?? DEFAULT_CHAIN_ID;
  return chainId;
};

export const useChainProperty = <T = any>(obj: ChainProperty<T>) => {
  const chainId = useChainID();
  return obj[chainId] ?? obj[DEFAULT_CHAIN_ID];
};

export const useWeb3 = () => {
  const account = useAccount();
  const network = useNetwork();
  const chain = useChain();

  return {
    ...network,
    ...account,
    chain,
  };
};

export const useUniswapClient = () => {
  return useChainProperty(apolloClient);
};

export const useGraphClient = () => {
  return useChainProperty(graphqlClient);
};

export const useAddress = (address: Address) => {
  return useChainProperty(address);
};

export const useChainContract = <T extends any[]>(
  addr: Address | string,
  abi: T
) => {
  const chainId = useChainID();
  const signer = useSigner()?.data;
  const provider = useProvider();
  const address =
    typeof addr === "string" ? addr : addr[chainId] ?? addr[DEFAULT_CHAIN_ID];
  return useContract<T>({ address, abi, signerOrProvider: signer ?? provider });
};
