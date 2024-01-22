import React, { useState } from "react";
import ActionButton from '../../components/ActionButton'
import { useNavigate } from 'react-router-dom';
import { generateProof, verifyProof } from "@semaphore-noir/proof"
import { utils } from "ethers"


export default function Login() {



    // 2 login options - 1. twitter 2. login with proof

    // the first time user uses the app logs in with x -> if registration is successul the user gets the jwt token is rediretcted to a modal when he can generate and download the proof
    // if the user has already been registered with twitter; he needs to login with proof
    // onclick "loginWithProof" redirects to a new modal where the user can upload their proof
    // get the full Proof from text file and convert it to an object to use it in the verifyProof()
    // if verifyProof is true user backend generates a JWT token and the user is allowed to use the app
    async function verify() {

        // upload the text file
        // convert the text file from string to object

        // verifyProof($proof, $treeDepth)

        // if (true) {
        //     /generateToken
        // }

    }

    const [showLoginInput, setShowLoginInput] = useState(false);
    const [proofValue, setProofValue] = useState('');

    const navigate = useNavigate();

    const handleTwitterAuth = () => {
        if (!showLoginInput) {
            const twitterAuthUrl = `http://localhost:8000/auth/twitter`;
            window.location.href = twitterAuthUrl;
        }
    };

    const handleLoginToggle = () => {
        setShowLoginInput(!showLoginInput);
    };

    const handleProofLogin = () => {
        navigate('/chat');
    };

    return (
        <div className="login-container bg-custom-login-bg h-screen flex justify-center items-center">
            <div className="flex flex-col items-center w-full max-w-xs space-y-4">
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
                            <ActionButton onClick={handleProofLogin}>
                                Submit
                            </ActionButton>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}