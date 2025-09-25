"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import type { Chain } from "viem";

export const kiichainTestnet = {
  id: 1336,
  name: "Kiichain Testnet",
  nativeCurrency: {
    name: "Kiichain",
    symbol: "KII",
    decimals: 18,
  },
  rpcUrls: {
    public: {
      http: ["https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com"],
    },
    default: {
      http: ["https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Kiichain Explorer",
      url: "https://explorer.kiichain.io/testnet/",
    },
  },
  testnet: true,
} satisfies Chain;

export const config = getDefaultConfig({
  appName: "KimCil DApp",
  projectId: "9838fbc46e965487a982f0b127ab342f",
  chains: [kiichainTestnet],
  transports: {
    [kiichainTestnet.id]: http(),
  },
});
