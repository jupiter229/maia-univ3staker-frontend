import { chains, wagmiClient } from "@/config";
import { useUniswapClient } from "@/hooks/web3";
import { ApolloProvider } from "@apollo/client";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";
import { WagmiConfig } from "wagmi";

import "@/styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const client = useUniswapClient();
  return (
    <ApolloProvider client={client}>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-24 gap-6">
        {children}
      </main>
    </ApolloProvider>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider 
        chains={chains}
        coolMode
        showRecentTransactions
        >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
