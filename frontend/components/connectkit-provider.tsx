'use client'

import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { polygonMumbai } from "wagmi/chains";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.INFURA_ID, // or infuraId
    walletConnectProjectId: process.env.NEXT_PUBLIC_WC_ID || '',

    // Required
    appName: "Adme",
    chains: [polygonMumbai],
  }),
);

export const ConnectkitProvider = ({ children }) => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
};