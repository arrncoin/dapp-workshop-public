import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CertificationsModule = buildModule("CertificationsModule", (m) => {
  const certifications = m.contract("Certifications");

  return { certifications };
});

export default CertificationsModule;
