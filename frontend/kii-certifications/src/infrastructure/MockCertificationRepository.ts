import { Certification } from "../domain/models/Certification";
import { ICertificationRepository } from '../domain/interfaces/ICertificationRepository';


export class MockCertificationRepository implements ICertificationRepository {
    private certifications: Certification[] = [
        new Certification("1", "Certification 1", "a@b", "2022-01-01"),
        new Certification("2", "Certification 2", "c@d", "2023-01-01"),
    ];

    async save(certification: Certification): Promise<Certification> {
        this.certifications.push(certification);
        return certification;
    }

    async findAll(): Promise<Certification[]> {
        return this.certifications;
    }

    async update(certification: Certification): Promise<Certification> {
        const index = this.certifications.findIndex(c => c.id === certification.id);
        if (index !== -1) {
            this.certifications[index] = certification;
        }
        return certification;
    }

    async delete(id: string): Promise<void> {
        this.certifications = this.certifications.filter(c => c.id !== id);
    }
}
