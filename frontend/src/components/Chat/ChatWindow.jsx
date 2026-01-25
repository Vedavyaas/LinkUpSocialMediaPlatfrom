import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import authService from '../../services/auth';
import './ChatWindow.css';

const ChatWindow = ({ toUser, currentUser, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [connected, setConnected] = useState(false);
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!currentUser || !toUser) return;

        // Note: Connecting to API Gateway which routes to MessagingService
        // Adjust the URL if your gateway configuration differs
        const socket = new SockJS('http://localhost:9000/MESSAGINGSERVICE/ws');
        const stompClient = Stomp.over(socket);
        stompClient.debug = null; // Disable debug logs

        stompClient.connect(
            { 'Authorization': `Bearer ${authService.getCurrentUser()?.token}` }, // Assuming token is available
            (frame) => {
                setConnected(true);
                console.log('Connected to WebSocket');

                // Subscribe to user-specific queue
                stompClient.subscribe('/user/queue/chat', (message) => {
                    const receivedMsg = JSON.parse(message.body);
                    // Filter messages relevant to this conversation (optional, if queue is shared)
                    if (receivedMsg.fromUser === toUser || receivedMsg.fromUser === currentUser.username) {
                        setMessages(prev => [...prev, receivedMsg]);
                    }
                });
            },
            (error) => {
                console.error('WebSocket Error:', error);
                setConnected(false);
            }
        );

        stompClientRef.current = stompClient;

        return () => {
            if (stompClientRef.current) {
                try {
                    stompClientRef.current.disconnect(() => {
                        console.log("Disconnected");
                    });
                } catch (e) {
                    console.warn("Error disconnecting stomp client", e);
                }
            }
        };
    }, [toUser, currentUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        if (!connected || !stompClientRef.current) {
            alert("Not connected to chat server. Please check your connection.");
            return;
        }

        const chatMessage = {
            toUser: toUser,
            message: newMessage
        };

        try {
            stompClientRef.current.send("/app/chat", {}, JSON.stringify(chatMessage));

            // Optimistically add to UI
            const optimisticMsg = {
                fromUser: currentUser.username,
                message: newMessage,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, optimisticMsg]);
            setNewMessage('');
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    return (
        <div className="chat-window-container glass-panel">
            <div className="chat-header">
                <div className="chat-user-info">
                    <span className={`status-dot ${connected ? 'online' : 'offline'}`}></span>
                    <div>
                        <h3>{toUser}</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {connected ? 'Active' : 'Connecting...'}
                        </span>
                    </div>
                </div>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && <div className="empty-chat">Say hello!</div>}
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message-bubble ${msg.fromUser === currentUser.username ? 'sent' : 'received'}`}
                    >
                        <div className="message-text">{msg.message}</div>
                        <span className="message-time">
                            {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="macos-input"
                />
                <button type="submit" className="macos-btn-icon" disabled={!newMessage.trim()}>
                    ➤
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
