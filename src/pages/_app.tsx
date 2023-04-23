import { wagmiClient } from "@/config";
import { useUniswapClient } from "@/hooks/web3";
import "@/styles/globals.css";
import { CHAINS } from "@/types";
import { ApolloProvider } from "@apollo/client";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";
import { WagmiConfig } from "wagmi";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const client = useUniswapClient();
  return (
    <ApolloProvider client={client}>
      <Header />
      <main className="flex flex-col items-center px-12 py-8 gap-6">
        {children}
      </main>
    </ApolloProvider>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={CHAINS} showRecentTransactions>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
