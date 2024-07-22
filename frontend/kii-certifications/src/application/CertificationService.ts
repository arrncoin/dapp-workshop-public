import { Certification } from "../domain/models/Certification";
import { ICertificationRepository } from "../domain/interfaces/ICertificationRepository";

export class CertificationService {
    constructor(private certificationRepository: ICertificationRepository) { }

    async createCertification(id: string, name: string, email: string): Promise<Certification> {
        const certification = new Certification(id, name, email);
        return await this.certificationRepository.save(certification);
    }
    // async getCertifications(): Promise<Certification[]> {
    //     return await this.certificationRepository.findAll();
    // }
    async getCertificationById(id:string): Promise<Certification> {
        return await this.certificationRepository.findById(id);
    }
    async updateCertification(id: string): Promise<boolean> {
        return await this.certificationRepository.update(id);
    }
}
