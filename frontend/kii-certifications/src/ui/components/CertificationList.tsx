import React, { useEffect, useState } from "react";
import { Certification } from "../../domain/models/Certification";
import { CertificationService } from "../../application/CertificationService";
// import { KiiCertificationRepository } from "../../infrastructure/KiiCertificationRepository";
import { MockCertificationRepository } from "../../infrastructure/MockCertificationRepository";


const certificationRepository = new MockCertificationRepository();
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



    return (
        <div className="p-4 bg-[#F9F9F9]  rounded-lg shadow-md">
            <ul>
                {certifications.map(cert => (
                    <li key={cert.id} className="mb-2 border-y-solid border-y-1 border-[#EAECF0] py-4">
                        <div className="flex gap-3 items-center">
                            <div className="p-2 rounded-full bg-base-300">
                                <svg className="text-lg" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                    <path d="M0 0h24v24H0z" fill="none" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-info font-bold">{cert.name}</div>
                                <div className="text-gray-500">{cert.date}</div>
                            </div>
                        </div>
                        <div className="text-black dark:text-white">Email: <span className="text-info font-semibold">{cert.email}</span></div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CertificationList;
