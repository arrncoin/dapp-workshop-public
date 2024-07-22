

import { ICertificationRepository } from "../domain/interfaces/ICertificationRepository";
import { ethers } from "ethers";
import { Certification } from "../domain/models/Certification";
import contractABI from "../assets/Certifications.json"
// import dotenv from "dotenv"
// dotenv.config()

const CONTRACT_ADDRESS = "0x1bee4B2b613f77C34ccF9448F90Fd3600bE85caa";
const CONTRACT_ABI = contractABI.abi;
const WALLET_MNEMONIC = "";
console.log(WALLET_MNEMONIC)
//TODO: Verify the operations
export class KiiCertificationRepository implements ICertificationRepository {

    private provider: ethers.providers.JsonRpcProvider;
    private contract: ethers.Contract;
    private wallet: ethers.Wallet;
    private signer: ethers.Wallet

    constructor() {
        this.provider = this.getProvider()
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
        this.wallet = ethers.Wallet.fromMnemonic(WALLET_MNEMONIC!);
        this.signer = this.wallet.connect(this.provider)
        this.contract = this.contract.connect(this.signer)
    }
    getProvider(): ethers.providers.JsonRpcProvider {
        const url = "https://a.sentry.testnet.kiivalidator.com:8645/";
        const provider = new ethers.providers.JsonRpcProvider(url, {
            chainId: 123454321,
            name: "kiichaind",
        });
        return provider;
    }
    async save(certification: Certification): Promise<Certification> {
        const tx = await this.contract.createCertification(certification.id, certification.name, certification.email);
        await tx.wait();
        return certification;
    }

    // async findAll(): Promise<Certification[]> {
    //     const certificationsFromChain = await this.contract.getCertifications();
    //     return certificationsFromChain.map((cert: any) => new Certification(cert.id.toString(), cert.name, cert.email, cert.isValid));
    // }

    async findById(id: string): Promise<Certification> {
        const certificationFromChain: Certification = await this.contract.getCertification(id);
        return certificationFromChain
    }

    async update(id: string): Promise<boolean> {
        const tx = await this.contract.invalidContract(id);
        await tx.wait();
        return true;
    }
}
