'use client'

import { WagmiConfig, createConfig, sepolia } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.NEXT_PUBLIC_INFURA_ID, // or infuraId
    walletConnectProjectId: process.env.NEXT_PUBLIC_WC_ID || '',

    // Required
    appName: "Adme",
    chains: [sepolia],
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