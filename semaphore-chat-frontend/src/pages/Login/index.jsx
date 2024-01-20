import React, { useState } from "react";
import ActionButton from '../../components/ActionButton'
import { useNavigate } from 'react-router-dom';

export default function Login() {

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
                        Login
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