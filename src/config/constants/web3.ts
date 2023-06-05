import { ChainID, CHAINS } from "@/types";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient } from "wagmi";
import { metis } from "@wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { provider, webSocketProvider } = configureChains(CHAINS, [
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: "",
  // projectId: "YOUR_PROJECT_ID",
  chains: CHAINS,
});

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors,
});

export const DEFAULT_CHAIN_ID = ChainID.METIS;
export const DEFAULT_CHAIN = metis;
