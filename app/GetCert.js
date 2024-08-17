// CertificateList.js
import React from 'react';

const CertificateList = ({ certificates }) => {
    if (!certificates.length) {
        return <p>No certificates available.</p>;
    }

    return (
        <div>
            <h2></h2>
            <h2 className="text-xl font-bold">Certificate List</h2>
            <ul className="list-disc mt-4">
                {certificates.map((cert, index) => (
                    <li key={index} className="mb-2">
                        <p><strong>Transaction Hash:</strong> {cert.transactionHash}</p>
                        <p><strong>Contract Address:</strong> {cert.token.contract_address}</p>
                        <p><strong>From (Contract Creator):</strong> {cert.from_wallet}</p>
                        <p><strong>To (Applicant Address):</strong> {cert.to_wallet}</p>
                        <p><strong>Time:</strong> {cert.created_at}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CertificateList;
