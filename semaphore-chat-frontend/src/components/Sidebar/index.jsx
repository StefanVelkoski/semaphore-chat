import ActionButton from '../ActionButton';
import React, { useState, useEffect } from "react";
import UsernameChangeModal from '../../modals/UsernameModal'
import GetProofModal from '../../modals/GetProofModal'
import GenerateProofModal from '../../modals/GenerateProof';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const [currentUsername, setCurrentUsername] = useState('');


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGetProofModalOpen, setIsGetProofModalOpen] = useState(false);
    const [isGenerateProofModalOpen, setIsGenerateProofModalOpen] = useState(false);


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUsernameChange = (newUsername) => {
        console.log(`Username changed to ${newUsername}`);
        setCurrentUsername(newUsername);
    };


    const handleOpenGetProofModal = () => {
        console.log("Opening GetProofModal");

        setIsGetProofModalOpen(true);
    };

    const handleOpenGenerateProofModal = () => {
        console.log("Opening generate");

        setIsGenerateProofModalOpen(true);
    };

    const handleCloseGetProofModal = () => {
        setIsGetProofModalOpen(false);
    };
    const handleCloseGenerateProofModal = () => {
        setIsGenerateProofModalOpen(false);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('newUsername');
        localStorage.clear();

        navigate('/');
    };

    return (
        <div className="w-64 border-r p-4 flex flex-col">
            <div className="mb-2 p-2 border-b flex flex-col">
                <div>{currentUsername}</div>

            </div>

            <div className="mb-2 p-2 border-b flex flex-col">
                <ActionButton onClick={handleOpenModal}>Change Username</ActionButton>
            </div>
            <div className="mb-2 p-2 border-b flex flex-col">
                <ActionButton onClick={handleOpenGetProofModal}>Get Proof</ActionButton>
            </div>


            <div className="flex-grow"></div>

            <div className="mb-2 p-2 border-b flex flex-col">
                <ActionButton onClick={handleLogout}>Logout</ActionButton>
            </div>
            <UsernameChangeModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleUsernameChange} />
            <GetProofModal isOpen={isGetProofModalOpen} onClose={handleCloseGetProofModal} />
            <GenerateProofModal isOpen={isGenerateProofModalOpen} onClose={handleCloseGenerateProofModal} />

        </div>
    );
};

export default Sidebar