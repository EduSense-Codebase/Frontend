'use client';
import { useEffect, useState } from 'react';
import Button from './Button';
import { AI_ENDPOINT, API_PREFIX } from '../global';
import { httpPost } from '../utils';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [panelWidth, setPanelWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    useEffect(() => {
        const greetedBefore = sessionStorage.getItem('new_session') == 'false';
        if (isOpen && !greetedBefore) {
            setMessages((currMessages) => [
                ...currMessages,
                {
                    sender: 'ai',
                    text: "Welcome back! I'm excited to continue learning with you, what should we do next?",
                },
            ]);
            sessionStorage.setItem('new_session', 'false');
        }
    }, []);

    useEffect(() => {
        const usedBefore = localStorage.getItem('new_user') == 'false';
        if (isOpen && !usedBefore) {
            setMessages((currMessages) => [
                ...currMessages,
                {
                    sender: 'ai',
                    text: "Welcome back! I'm excited to continue learning with you, what should we do next?",
                },
            ]);
            localStorage.setItem('new_user', 'false');
        }
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isResizing) {
                const newWidth = window.innerWidth - e.clientX;
                setPanelWidth(Math.min(Math.max(newWidth, 300), 1800));
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    useEffect(() => {
        document.body.style.userSelect = isResizing ? 'none' : 'auto';
    }, [isResizing]);

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <motion.button
                    onClick={toggleChat}
                    className="fixed right-6 bottom-6 z-50 rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="relative h-6 w-6 scale-180">
                        <Image
                            src="/chat_icon.svg"
                            alt="Chat Icon"
                            fill
                            className="object-contain"
                        />
                    </div>
                </motion.button>
            )}

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="chat-panel"
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col border-l border-gray-200 bg-white shadow-xl"
                        style={{ width: `${panelWidth}px` }}
                    >
                        {/* Resize Handle */}
                        <div
                            className="absolute top-0 left-0 z-50 h-full w-2 cursor-ew-resize"
                            onMouseDown={() => setIsResizing(true)}
                        />

                        {/* Header */}
                        <div className="flex items-center justify-between border-b p-4">
                            <h2 className="text-lg font-semibold text-gray-700">
                                EduSense AI Chat
                            </h2>
                            <button onClick={toggleChat}>
                                <svg
                                    className="h-5 w-5 text-gray-600 hover:text-black"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 space-y-2 overflow-y-auto p-4">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`max-w-xs rounded-lg px-4 py-2 ${
                                        msg.sender === 'user'
                                            ? 'ml-auto self-end bg-blue-500 text-white'
                                            : 'mr-auto self-start bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    {msg.sender === 'ai' ? (
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="flex items-center space-x-2 border-t p-4 text-gray-400">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter'}
                                className="flex-1 rounded-lg border px-4 py-2 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Ask me anything..."
                            />
                            <Button displayName="Send" onClick={} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;
