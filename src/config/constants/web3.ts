import { ChainID, WAGMI_CHAINS } from "@/types";
import { configureChains, createClient } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";

const { provider, webSocketProvider } = configureChains(WAGMI_CHAINS, [
  publicProvider(),
]);

export const MetaMask = new MetaMaskConnector({
  chains: WAGMI_CHAINS,
});

export const connectors = [MetaMask];

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors,
});

export const DEFAULT_CHAIN_ID = ChainID.GOERLI;
