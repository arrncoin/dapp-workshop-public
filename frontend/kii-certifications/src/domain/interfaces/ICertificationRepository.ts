import { Certification } from "../models/Certification";

export interface ICertificationRepository {
    save(certification: Certification): Promise<Certification>;
    // findAll(): Promise<Certification[]>;
    findById(id:string): Promise<Certification>
    update(id: string): Promise<boolean>;
}
