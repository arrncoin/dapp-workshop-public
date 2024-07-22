

import { ICertificationRepository } from "../domain/interfaces/ICertificationRepository";
import { ethers } from "ethers";
import { Certification } from "../domain/models/Certification";


const CONTRACT_ADDRESS = "0xContractAddress";
const CONTRACT_ABI = [{}];
    //TODO: Verify the operations
export class KiiCertificationRepository implements ICertificationRepository {
    private provider: ethers.providers.JsonRpcProvider;
    private contract: ethers.Contract;
    private signer: ethers.Signer;

    constructor() {
        this.provider = this.getProvider()
        this.signer = this.provider.getSigner();
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
    }
    getProvider(): ethers.providers.JsonRpcProvider {
    const url = "https://a.sentry.testnet.kiivalidator.com:8645/";
    const provider = new ethers.providers.JsonRpcProvider(url, {
        chainId: 123454321,
        name: "kiichaind",
    });
    return provider;
}
    async save(certification: Certification): Promise < Certification > {
    const tx = await this.contract.createCertification(certification.name, certification.email, certification.date);
    await tx.wait();
    return certification;
}

    async findAll(): Promise < Certification[] > {
    const certificationsFromChain = await this.contract.getCertifications();
    return certificationsFromChain.map((cert: any) => new Certification(cert.id.toString(), cert.name, cert.issuer, cert.date));
}

    async update(certification: Certification): Promise < Certification > {
    const tx = await this.contract.updateCertification(certification.id, certification.name, certification.email, certification.date);
    await tx.wait();
    return certification;
}
    //TODO: Check if delete is an option
    async delete (id: string): Promise < void> {
    const tx = await this.contract.deleteCertification(id);
    await tx.wait();
}
}
