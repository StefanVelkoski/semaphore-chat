import ActionButton from '../ActionButton';
import React, { useState, useEffect } from "react";
import UsernameChangeModal from '../../modals/UsernameModal'
import GetProofModal from '../../modals/GetProofModal'

const Sidebar = () => {
    const usernames = ['Zmaj'];



    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGetProofModalOpen, setIsGetProofModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUsernameChange = (newUsername) => {
        console.log(`Username changed to ${newUsername}`);
    };


    const handleOpenGetProofModal = () => {
        console.log("Opening GetProofModal");

        setIsGetProofModalOpen(true);
    };

    const handleCloseGetProofModal = () => {
        setIsGetProofModalOpen(false);
    };


    return (
        <div className="w-64 border-r p-4 flex flex-col">
            {usernames.map((username) => (
                <div key={username} className="mb-2 p-2 border-b flex flex-col">
                    <div>{username}</div>

                </div>
            ))}

            <div className="mb-2 p-2 border-b flex flex-col">
                <ActionButton onClick={handleOpenModal}>Change Username</ActionButton>
            </div>
            <div className="mb-2 p-2 border-b flex flex-col">
                <ActionButton onClick={handleOpenGetProofModal}>Get Proof</ActionButton>
            </div>
            <div className="flex-grow"></div>

            <div className="mb-2 p-2 border-b flex flex-col">
                <ActionButton onClick={() => console.log(`Logout `)}>Logout</ActionButton>
            </div>
            <UsernameChangeModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleUsernameChange} />
            <GetProofModal isOpen={isGetProofModalOpen} onClose={handleCloseGetProofModal} />
        </div>
    );
};

export default Sidebar;