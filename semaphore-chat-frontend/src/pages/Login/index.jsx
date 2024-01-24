import React, { useEffect, useState } from "react";
import ActionButton from '../../components/ActionButton'
import { useNavigate } from 'react-router-dom';
import { generateProof, verifyProof } from "@semaphore-noir/proof"
import { utils } from "ethers"
import GenerateProofModal from "../../modals/GenerateProof";


export default function Login() {

    const [showGenerateProofModal, setShowGenerateProofModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [showLoginInput, setShowLoginInput] = useState(false);
    const [proofValue, setProofValue] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);


    const navigate = useNavigate();

    useEffect(() => {
        const urlParam = new URLSearchParams(window.location.search);
        const error = urlParam.get('error');

        if (error) {
            if (error === 'already_registered') {
                setErrorMessage('This Twitter account is already registered. Try using another one.');
                setTimeout(() => navigate('/'), 1000);
            }
        }
    }, [navigate]);

    const handleTwitterAuth = () => {
        if (!showLoginInput) {
            const twitterAuthUrl = `http://localhost:8000/auth/twitter`;
            window.location.href = twitterAuthUrl;
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleLoginToggle = async (proof) => {
        setShowLoginInput(!showLoginInput);
    };



    const closeGenerateProofModal = () => {
        setShowGenerateProofModal(false);
    };

    const handleProofLogin = async () => {
        if (uploadedFile) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const fileContent = event.target.result;
                    const proofObject = JSON.parse(fileContent);
                    const verified = await verifyProof(proofObject, 16);

                    if (verified) {

                        navigate('/chat');
                    } else {
                        console.log('Proof verification failed');
                    }
                } catch (error) {
                    console.error('Error processing proof:', error);
                }
            };
            reader.readAsText(uploadedFile);
        }
    };

    return (
        <div className="login-container bg-custom-login-bg h-screen flex justify-center items-center">
            <div className="flex flex-col items-center w-full max-w-xs space-y-4">
                {errorMessage && (
                    <div className="w-full mb-2 p-2 text-red-500 text-center">
                        {errorMessage}
                    </div>
                )}
                <div className="w-full mb-2 p-2">
                    <ActionButton onClick={handleTwitterAuth} disabled={showLoginInput}>
                        Login with X
                    </ActionButton>
                </div>
                <div className="w-full mb-2 p-2">
                    <ActionButton onClick={handleLoginToggle}>
                        Login with Proof
                    </ActionButton>
                </div>
                {showLoginInput && (
                    <div className="flex flex-col items-center w-full">
                        <input className="mb-2 p-2 border border-gray-300 rounded w-full" type="text" placeholder="ZK proof" />
                        <div className="w-full mb-2 p-2">
                            <input
                                type="file"
                                accept=".txt"
                                onChange={handleFileChange}
                                className="mb-2 p-2 border border-gray-300 rounded w-full"
                            />
                            <ActionButton onClick={handleProofLogin}>
                                Submit
                            </ActionButton>
                        </div>
                    </div>
                )}
            </div>

            {showGenerateProofModal && (
                <GenerateProofModal
                    isOpen={showGenerateProofModal}
                    onClose={closeGenerateProofModal}
                />
            )}

        </div>
    );
}