"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";

const kiichainTestnet = {
  id: 1336,
  name: "Kiichain Testnet",
  nativeCurrency: {
    name: "Kiichain",
    symbol: "KII",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com"] },
  },
  blockExplorers: {
    default: { name: "kiichain Explorer", url: "https://explorer.kiichain.io/testnet/" },
  },
  testnet: true,
  
  batch: {
    multicall: false,
  },
};

export const config = getDefaultConfig({
  appName: "KimCil DApp",
  projectId: "9838fbc46e965487a982f0b127ab342f",
  chains: [kiichainTestnet],
  transports: {
    [kiichainTestnet.id]: http(),
  },
});
