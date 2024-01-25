import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import ActionButton from '../../components/ActionButton'
import Sidebar from '../../components/Sidebar'
import MessageList from '../../components/MessageList'
import MessageInput from '../../components/MessageInput'
import UsernameChangeModal from '../../modals/UsernameModal'
import io from 'socket.io-client';


export default function ChatBoard() {
    const [usernames, setUsernames] = useState(['Zmaj']);


    const location = useLocation();

    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('http://localhost:8000/messages', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
        const token = localStorage.getItem('jwtToken');

        const newSocket = io('http://localhost:8000',);
        console.log('new socket', newSocket)

        newSocket.on('connect_error', (error) => {
            console.error('Connection Error:', error);
        });

        newSocket.on('connect_timeout', (timeout) => {
            console.error('Connection Timeout:', timeout);
        });


        setSocket(newSocket);

        newSocket.on('message', (message) => {
            setMessages((prevMessages) => [message, ...prevMessages]);
        });
        console.log(socket)
        return () => newSocket.close();
    }, []);


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
                <MessageList className="flex-grow overflow-auto" messages={[...messages].reverse()}/>
                <MessageInput className="flex-none" socket={socket} username={usernames} />
            </div>
        </div>
    );

}