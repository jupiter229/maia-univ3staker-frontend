import { ChainID, CHAINS } from "@/types";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { metis } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  CHAINS,
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "",
  // projectId: "YOUR_PROJECT_ID",
  chains: chains,
});

export const wagmiClient = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors,
});

export const DEFAULT_CHAIN_ID = ChainID.METIS;
export const DEFAULT_CHAIN = metis;
