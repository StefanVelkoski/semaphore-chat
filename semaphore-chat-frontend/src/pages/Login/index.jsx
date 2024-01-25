import React, { useEffect, useState } from "react";
import ActionButton from '../../components/ActionButton'
import { useNavigate } from 'react-router-dom';
import { generateProof, verifyProof } from "@semaphore-noir/proof"
import { utils } from "ethers"
import GenerateProofModal from "../../modals/GenerateProof";
import './styles.css';



export default function Login() {

    const [showGenerateProofModal, setShowGenerateProofModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [showLoginInput, setShowLoginInput] = useState(false);
    const [proofValue, setProofValue] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


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

    const handleLoginToggle = async () => {
        setShowLoginInput(!showLoginInput);
        setErrorMessage('');
    };



    const closeGenerateProofModal = () => {
        setShowGenerateProofModal(false);
    };

    const handleProofLogin = async () => {
        if (!uploadedFile) {
            setErrorMessage('Please upload a proof file.');
            return;
        }
        if (uploadedFile) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const fileContent = event.target.result;
                    const proofObject = JSON.parse(fileContent);

                    if (Array.isArray(proofObject.proof.publicInputs)) {
                        proofObject.proof.publicInputs = new Map(proofObject.proof.publicInputs);
                    }

                    if (typeof proofObject.proof.proof === 'object' && !Array.isArray(proofObject.proof.proof)) {
                        proofObject.proof.proof = Object.values(proofObject.proof.proof);
                    }

                    console.log("before awaiting verify");
                    const verified = await verifyProof(proofObject, 16);
                    console.log(verified);
                    if (verified) {
                        fetch('http://localhost:8000/generateToken', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.text();
                            })
                            .then(token => {
                                localStorage.setItem('jwtToken', token);
                                console.log(localStorage.getItem('jwtToken'));
                                navigate('/chat');
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });

                    } else {
                        console.log('Proof verification failed');
                    }
                } catch (error) {
                    setIsLoading(false);
                    console.error('Error processing proof:', error);
                    setErrorMessage('Error processing proof.');
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
                        <div className="w-full mb-2 p-2">
                            <p className="text-center text-gray-600">Upload your proof</p>
                        </div>
                        <div className="w-full mb-2 p-2">
                            <input
                                type="file"
                                accept=".txt"
                                onChange={handleFileChange}
                                className="mb-2 p-2 border border-gray-300 rounded w-full"
                            />
                            <ActionButton className="flex justify-center items-center"
                                onClick={handleProofLogin} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <div className="loader"></div>
                                        <span>Verifying</span>
                                    </>
                                ) : (
                                    "Submit"
                                )}
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