import React, { useEffect, useState } from "react";
import { Certification } from "../../domain/models/Certification";
import { CertificationService } from "../../application/CertificationService";
import { KiiCertificationRepository } from "../../infrastructure/KiiCertificationRepository";
// import { MockCertificationRepository } from "../../infrastructure/MockCertificationRepository";

const certificationRepository = new KiiCertificationRepository();
const certificationService = new CertificationService(certificationRepository);

const CertificationList: React.FC = () => {
    const [certification, setCertification] = useState<Certification | null>(null);
    const [id, setId] = useState<string>("");

    const handleSearch = async () => {
        if (id) {
            const data = await certificationService.getCertificationById(id);
            setCertification(data);
        }
    };

    return (
        <div className="p-4 bg-[#F9F9F9] rounded-lg shadow-md">
            <div className="mb-4">
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="border p-2 rounded"
                    placeholder="Enter Certification ID"
                />
                <button onClick={handleSearch} className="ml-2 p-2 bg-blue-500 text-white rounded">
                    Search
                </button>
            </div>
            {certification ? (
                <div className="mb-2 border-y-solid border-y-1 border-[#EAECF0] py-4">
                    <div className="flex gap-3 items-center">
                        <div className="p-2 rounded-full bg-base-300">
                            <svg className="text-lg" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                <path d="M0 0h24v24H0z" fill="none" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-info font-bold">{certification.name}</div>
                        </div>
                    </div>
                    <div className="text-black dark:text-white">Email: <span className="text-info font-semibold">{certification.email}</span></div>
                </div>
            ) : (
                <div>No certification found</div>
            )}
        </div>
    );
};

export default CertificationList;
