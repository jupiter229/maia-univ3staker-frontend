import { DEFAULT_CHAIN_ID, apolloClient, graphqlClient } from "@/config";
import { Address, ChainID, ChainProperty } from "@/types";
import { Contract, ContractInterface } from "ethers";
import { useMemo } from "react";
import { goerli, useAccount, useNetwork, useProvider, useSigner } from "wagmi";

export const useChain = () => {
  const { chain = goerli } = useNetwork();
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
  const signer = useSigner();
  const provider = useProvider();
  return signer?.data ?? provider;
};

export const useContract = <T extends Contract = Contract>(
  addr?: string | Address,
  ABI?: ContractInterface
) => {
  const address = useAddress(addr);
  const signerOrProvider = useSignerOrProvider();
  return useMemo(() => {
    if (!address || !ABI) return null;
    return new Contract(address, ABI, signerOrProvider) as T;
  }, [ABI, address, signerOrProvider]);
};
