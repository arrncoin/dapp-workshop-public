import React, { useEffect, useState } from "react";
import { Certification } from "../../domain/models/Certification";
import { CertificationService } from "../../application/CertificationService";
import { KiiCertificationRepository } from "../../infrastructure/KiiCertificationRepository";


const certificationRepository = new KiiCertificationRepository();
const certificationService = new CertificationService(certificationRepository);

const CertificationList: React.FC = () => {
    const [certifications, setCertifications] = useState<Certification[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await certificationService.getCertifications();
            setCertifications(data);
        };
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        await certificationService.deleteCertification(id);
        setCertifications(certifications.filter(cert => cert.id !== id));
    };

    return (
        <div>
            <h2>Certification List</h2>
            <ul>
                {certifications.map(cert => (
                    <li key={cert.id}>
                        {cert.name} - {cert.email} - {cert.date}
                        <button onClick={() => handleDelete(cert.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CertificationList;
