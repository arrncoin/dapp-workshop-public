import { Certification } from "../domain/models/Certification";
import { ICertificationRepository } from "../domain/interfaces/ICertificationRepository";

export class CertificationService {
    constructor(private certificationRepository: ICertificationRepository) { }

    async createCertification(name: string, issuer: string, date: string): Promise<Certification> {
        const certification = new Certification(Date.now().toString(), name, issuer, date);
        return await this.certificationRepository.save(certification);
    }

    async getCertifications(): Promise<Certification[]> {
        return await this.certificationRepository.findAll();
    }

    async updateCertification(id: string, name: string, issuer: string, date: string): Promise<Certification> {
        const certification = new Certification(id, name, issuer, date);
        return await this.certificationRepository.update(certification);
    }

    async deleteCertification(id: string): Promise<void> {
        await this.certificationRepository.delete(id);
    }
}
