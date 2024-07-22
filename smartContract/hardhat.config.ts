import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19", // Solidity Version
  networks: {
    kiichain: {
      url: "https://a.sentry.testnet.kiivalidator.com:8645",
      accounts: [""],
      chainId: 123454321,
    },
  },
};

export default config;
