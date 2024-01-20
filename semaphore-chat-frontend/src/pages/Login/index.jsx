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
        <div className="login-container bg-custom-login-bg">
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col space-y-4 items-center">
                    <div className="flex w-full justify-center">
                        <ActionButton className="flex-grow" onClick={handleTwitterAuth} disabled={showLoginInput}>
                            Login with X
                        </ActionButton>
                    </div>
                    <div className="flex w-full justify-center">
                        <ActionButton className="flex" onClick={handleLoginToggle}>
                            Login
                        </ActionButton>
                    </div>
                    {showLoginInput && (
                        <div className="flex flex-col items-center">
                            <input className="mb-2 p-2 border border-gray-300 rounded w-full max-w-xs" type="text" placeholder="ZK proof" />
                            <ActionButton onClick={handleProofLogin}>Submit</ActionButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}