import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import GenerateProofModal from "../../modals/GenerateProof";
import GetProofModal from "../../modals/GetProofModal";

export default function GetProofPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
    }, []);

    const closeGenerateProofModal = () => {
        navigate('/chat');
    };

    return (
        <div>
            <GenerateProofModal
                isOpen={true}
                onClose={closeGenerateProofModal}
            />
        </div>
    );
}
