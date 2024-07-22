import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19", // Solidity Version
  networks: {
    kiichain: {
      url: "https://a.sentry.testnet.kiivalidator.com:8645",
      chainId: 123454321,
      accounts: [`0x${process.env.WALLET_API_KEY}`],
    },
  },
};

export default config;
