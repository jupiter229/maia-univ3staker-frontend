import { ChainID } from "@/types";
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient } from "wagmi";
import { goerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import { publicProvider } from "wagmi/providers/public";
import { ALCHEMY_KEY } from "./env";
export const { chains, provider } = configureChains(
  [goerli],
  [
    alchemyProvider({ apiKey: ALCHEMY_KEY }),
    publicProvider()
  ]
);

export const { connectors } = getDefaultWallets({
  appName: 'Maia v3Staker',
  chains
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

export const DEFAULT_CHAIN_ID = ChainID.GOERLI;
