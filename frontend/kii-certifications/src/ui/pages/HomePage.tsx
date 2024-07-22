import React from "react";
import CertificationList from "../components/CertificationList";

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Certification CRUD</h1>
            <CertificationList />
        </div>
    );
};

export default HomePage;
