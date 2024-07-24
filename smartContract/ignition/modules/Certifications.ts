import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import dotenv from "dotenv";
dotenv.config();

const CertificationsModule = buildModule("CertificationsModule", (m) => {
  const certifications = m.contract("Certifications", [
    process.env.WALLET_ADDRESS!,
  ]);

  return { certifications };
});

export default CertificationsModule;
