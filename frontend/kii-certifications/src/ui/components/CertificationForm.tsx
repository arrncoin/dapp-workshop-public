import React, { useState } from "react";
// import { MockCertificationRepository } from "../../infrastructure/repositories/MockCertificationRepository";
import { KiiCertificationRepository } from "../../infrastructure/KiiCertificationRepository";
import { CertificationService } from "../../application/CertificationService";

const certificationRepository = new KiiCertificationRepository();
const certificationService = new CertificationService(certificationRepository);

const CertificationForm: React.FC = () => {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const certification = await certificationService.createCertification(id, name, email);
            alert(`Certification created: ${certification.name}`);
            setName("");
            setEmail("");
            setId("");
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-slate-800 rounded-lg shadow-md space-y-4">
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Id:</label>
                <input
                    type="number"
                    value={id}
                    onChange={e => setId(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Create Certification
            </button>
        </form>
    );
};

export default CertificationForm;
