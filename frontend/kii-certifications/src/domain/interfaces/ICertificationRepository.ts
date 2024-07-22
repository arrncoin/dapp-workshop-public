import { Certification } from "../models/Certification";

export interface ICertificationRepository {
    //TODO: Verify the transactions to do in the smart contract
    save(certification: Certification): Promise<Certification>;
    findAll(): Promise<Certification[]>;
    update(certification: Certification): Promise<Certification>;
    delete(id: string): Promise<void>;
}
