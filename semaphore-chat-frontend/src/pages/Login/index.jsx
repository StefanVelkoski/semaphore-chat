import React, { useEffect, useState } from "react";
import ActionButton from '../../components/ActionButton'
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { SHA256 } from 'crypto-js';
import { Identity } from '@semaphore-protocol/identity';
import { Group } from "@semaphore-protocol/group"
import { generateProof, verifyProof } from "@semaphore-noir/proof"
import { utils } from "ethers"

const hashPassword = (password) => {
    return SHA256(password.trim()).toString();
};

const fetchGroupData = async () => {
    try {
        const response = await fetch('http://localhost:8000/group');
        if (!response.ok) throw new Error('Failed to fetch group data');
        const groupData = await response.json();
        console.log(groupData)
        return groupData;
    } catch (error) {
        console.error('Error fetching group data:', error);
    }
};

export default function Login() {
    const [action, setAction] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [showLoginInput, setShowLoginInput] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleActionSelect = (selectedAction) => {
        setAction(selectedAction);
        setErrorMessage('');
    };

    const handleRegister = async () => {
        if (!password) {
            setErrorMessage("Password is required");
            return;
        }

        console.log('Register with:', password);
        const hashedPassword = hashPassword(password);
        const registerUrl = `http://localhost:8000/addMember`;
        const identity = new Identity(hashedPassword);
        const commitment = identity.getCommitment();
        try {
            const response = await fetch(registerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commitment }, (key, value) =>
                    typeof value === 'bigint' ? value.toString() : value
                ),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Registration successful:', data);
                navigate('/chat');
            } else {
                setErrorMessage(data.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Failed to register:', error);
            setErrorMessage('Registration failed. Please try again.');
        }
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = async () => {
        console.log('Login with:', password);

        if (!password) {
            setErrorMessage("Password is required");
            return;
        }
        setLoading(true);
        console.log('Logging in...');

        const hashedPassword = hashPassword(password);
        const identity = new Identity(hashedPassword);

        const groupData = await fetchGroupData();
        if (!groupData) return;

        const { Id: groupID, treeDepth, members } = groupData;
        const group = new Group(groupID, treeDepth, members);
        console.log(groupData)

        console.log(group)

        const externalNullifier = utils.formatBytes32String("Topic");
        const signal = utils.formatBytes32String("Hello world");

        const fullProof = await generateProof(identity, group, externalNullifier, signal);

        const verified = await verifyProof(fullProof, 16)
        console.log(verified)

        console.log("before", fullProof)

        const replacerFunction = (key, value) => {
            if (typeof value === 'bigint') {
                return value.toString();
            } else if (value instanceof Map) {
                return Array.from(value.entries());
            }
            return value;
        };

        // Stringify proof object with replacer function
        const jsonProof = JSON.stringify(fullProof, replacerFunction, 2)


        //const fullProofString = JSON.stringify(fullProof);


        //console.log("after", fullProof)
        try {
            console.log("here")
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullProof: jsonProof }),
            });

            const data = await response.json();

            if (response.ok) {

                setLoading(false);
                console.log('Proof verified successfully:', data);
                navigate('/chat');
            } else {
                setErrorMessage(data.message || 'Proof verification failed');
            }
        } catch (error) {
            console.error('Failed to send proof to backend:', error);
            setErrorMessage('Error verifying proof');
        }
    };

    const handleConnectWithX = () => {
        const twitterAuthUrl = `http://localhost:8000/auth/twitter`;
        window.location.href = twitterAuthUrl;
    };

    useEffect(() => {
        const urlParam = new URLSearchParams(window.location.search);
        const error = urlParam.get('error');
        const token = urlParam.get('token');

        if (error) {
            if (error === 'already_registered') {
                setErrorMessage('This Twitter account is already registered. Try using another one.');
                setTimeout(() => navigate('/'), 1000);
            }
        }
        if (token) {
            localStorage.setItem('authToken', token);
            setAction('register');
        }

    }, [navigate]);

    return (
        <div className="login-container bg-custom-login-bg h-screen flex justify-center items-center">
            <div className="flex flex-col items-center w-full max-w-xs space-y-4">
                {errorMessage && (
                    <div className="w-full mb-2 p-2 text-red-500 text-center">
                        {errorMessage}
                    </div>
                )}

                {loading && (
                    <div className="w-full mb-2 p-2 text-blue-500 text-center">
                        Loading...
                    </div>
                )}

                {!action && (
                    <>
                        <ActionButton onClick={() => handleActionSelect('register')}>
                            Register
                        </ActionButton>
                        <ActionButton onClick={() => handleActionSelect('login')}>
                            Login
                        </ActionButton>
                    </>
                )}

                {action === 'register' && (
                    <>
                        <ActionButton onClick={handleConnectWithX}>
                            Connect with X
                        </ActionButton>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <ActionButton onClick={handleRegister}>
                            Register
                        </ActionButton>
                    </>
                )}

                {action === 'login' && (
                    <>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <ActionButton onClick={handleLogin}>
                            Login
                        </ActionButton>
                    </>
                )}
            </div>
        </div>
    );
}
