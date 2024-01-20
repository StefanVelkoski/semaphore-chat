import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import ActionButton from '../../components/ActionButton'
import Sidebar from '../../components/Sidebar'
import MessageList from '../../components/MessageList'
import MessageInput from '../../components/MessageInput'
import UsernameChangeModal from '../../modals/UsernameModal'


export default function ChatBoard() {
    const [usernames, setUsernames] = useState(['Zmaj']);


    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        if (token) {
        }
    }, [location]);

    return (
        <div className="flex h-screen pb-16">
            <Sidebar usernames={usernames} />
            <div className="flex flex-col flex-grow">
                <MessageList className="flex-grow overflow-auto" />
                <MessageInput className="flex-none" />
            </div>
        </div>
    );

}