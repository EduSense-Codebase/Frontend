'use client';
import React, { useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import './ChatWidget.scss';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { IAIAgentData, IAISession } from '../../typedef';
import { IMessages } from '@/app/Pages/AIChat/AIChatController';

interface AIAgentLoaderProps {
    agentName?: string;
    status?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

// A lightweight Gemini-style loader component for AI responses.
// - Uses Tailwind for styling (no external animation libs required)
// - Accessible: includes aria-live region so screen readers announce status updates
// - Props: agentName (optional), status (text to show), size (controls dimensions)
// Example usage:
// <AIAgentLoader agentName="Gemini" status="Thinking about the best answer..." />

function AIAgentLoader({
    agentName = 'EduSense AI',
    status = 'Thinking...',
    size = 'sm',
    className = '',
}: AIAgentLoaderProps) {
    const dims = {
        sm: { avatar: 2, dots: 0, text: 'text-sm' },
        md: { avatar: 10, dots: 4, text: 'text-base' },
        lg: { avatar: 14, dots: 5, text: 'text-lg' },
    }[size];

    return (
        <div className={`flex items-start gap-3 ${className}`}>
            <img src="/chat-icon.svg" alt="chatbot icon" className="chat-message-icon" />

            {/* text area + animated dots */}
            <div>
                <div className="mt-4 flex-col items-center gap-3">
                    <div>
                        <div className={`${dims.text} leading-snug font-medium text-[#4b76b3]`}>
                            {agentName}
                        </div>
                        <div className="sr-only" aria-live="polite">
                            {status}
                        </div>
                    </div>

                    {/* status text */}
                    <div className={`mt-1 ${dims.text} text-[#6b92d0]`}>{status}</div>

                    {/* animated dots box */}
                    <div className="loader-container" role="status">
                        <span
                            className="loader-dot"
                            style={{ width: '0.5rem', height: '0.5rem' }}
                        />
                        <span
                            className="loader-dot"
                            style={{ width: '0.5rem', height: '0.5rem' }}
                        />
                        <span
                            className="loader-dot"
                            style={{ width: '0.5rem', height: '0.5rem' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const UserMessageRender = (props: { message: IMessages; index: number }) => {
    return (
        <div key={props.index} className="user-message">
            {props.message.content}
        </div>
    );
};

const AIMessageRender = (props: { message: IMessages; index: number }) => {
    return (
        <div className="ai-message-container">
            <img src="/chat-icon.svg" alt="chatbot icon" className="chat-message-icon" />
            <div key={props.index} className="ai-message">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.message.content}</ReactMarkdown>
            </div>
        </div>
    );
};

const IndividualMessageRender = (props: { message: IMessages; index: number }) => {
    if (props.message.sender === 'user') {
        return <UserMessageRender {...props} />;
    }
    return <AIMessageRender {...props} />;
};

const MessagesRender = (props: { messages: IMessages[]; thinking: IAIThinking | undefined }) => {
    return (
        <div className="message-render">
            {props.messages.map((message, index) => (
                <React.Fragment key={`ai-chat-message-${index}`}>
                    <IndividualMessageRender message={message} index={index} />
                </React.Fragment>
            ))}
            {props.thinking ? <AIAgentLoader status={props.thinking.verbose_name} /> : null}
            <div style={{ display: 'none' }} />
        </div>
    );
};

export interface IAIThinking {
    step: number;
    verbose_name: string;
}

export interface IChatWidgetProps {
    messages: IMessages[];
    thinking: IAIThinking | undefined;
    sessions: IAISession[];
    agents: IAIAgentData[];
    currSession: number;
    currAgent: string | undefined;
    selectAIAgent: (agentId: string) => void;
    setCurrSession: (currSession: number) => void;
    sendMessage: (message: string) => void;
    createNewSession: () => void;
}

const ChatWidget: React.FC<IChatWidgetProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [panelWidth, setPanelWidth] = useState(550);
    const [isResizing, setIsResizing] = useState(false);

    const [input, setInput] = useState('');

    const toggleChat = () => {
        if (isOpen) {
            setSidebarOpen(false);
        } // close sidebar
        setIsOpen(!isOpen);
    };

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

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.sendMessage(input);
        setInput('');
    };

    return (
        <div className="chat-window z-50">
            {/* Floating Button */}
            {!isOpen && (
                <motion.button
                    onClick={toggleChat}
                    className="chat-icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="relative top-[-4px] h-6 w-6 scale-180">
                        <Image
                            src="/chat-icon-light.svg"
                            alt="Chat Icon"
                            fill
                            className="object-contain"
                        />{' '}
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
                        className="chat-panel"
                        style={{ width: `${panelWidth}px` }}
                    >
                        {/* Resize Handle */}
                        <div
                            className="absolute top-0 left-0 z-50 h-full w-2 cursor-ew-resize"
                            onMouseDown={() => setIsResizing(true)}
                        />
                        {/* Header */}
                        <div className="header">
                            <button onClick={toggleSidebar}>
                                <img src="/menu.svg" alt="menu icon" className="sidebar-menu" />
                            </button>
                            <h2> EduSense AI Chat </h2>
                            <button onClick={toggleChat}>
                                <img
                                    src="/forward-arrow.svg"
                                    alt="go back"
                                    className="arrow-icon"
                                />
                            </button>
                        </div>
                        <div className="chat-body">
                            <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                                <button className="new-session" onClick={props.createNewSession}>
                                    <img src="/blue-plus.png" alt="plus icon" className="add-btn" />
                                    <h3>New Session</h3>
                                </button>
                                <div className="sessions-wrapper">
                                    <h3>Sessions</h3>
                                    <div className="sessions-container">
                                        {props.sessions.length > 0 ? (
                                            props.sessions.map((session: IAISession, index) => (
                                                <div
                                                    key={index}
                                                    className={`session ${props.currSession == session.id ? 'session-selected' : ''}`}
                                                    onClick={() => props.setCurrSession(session.id)}
                                                >
                                                    <p>{session.name}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="session">
                                                <p>No sessions yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <MessagesRender messages={props.messages} thinking={props.thinking} />
                        </div>

                        {/* Input */}
                        <div className="chat-footer">
                            <form className="chat-footer-input" onSubmit={sendMessage}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter'}
                                    className="flex-1 rounded-lg border px-4 py-2 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Ask me anything..."
                                />
                                <button type="submit" className="send-icon">
                                    <img src="/airplane.svg" alt="send" />
                                </button>
                            </form>
                            {props.agents.length > 1 ? (
                                <div className="select-mode">
                                    <p>Mode: </p>
                                    <div className="mode-btns">
                                        {props.agents.map((agent, index) => {
                                            return (
                                                <React.Fragment key={`ai-agent-${index}`}>
                                                    <button
                                                        className={`mode-btn ${props.currAgent == agent.internal_name ? 'selected' : ''}`}
                                                        onClick={() =>
                                                            props.selectAIAgent(agent.internal_name)
                                                        }
                                                    >
                                                        {agent.external_name}
                                                    </button>
                                                    {index < props.agents.length - 1 ? (
                                                        <p>|</p>
                                                    ) : null}
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatWidget;
