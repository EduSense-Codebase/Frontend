'use client';
import React, { useEffect, useState } from 'react';
import Button from '../Button';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { IAIAgentData, IAISession } from '../../typedef';
import { IAIThinking, IMessages } from '@/app/Pages/AIChat/AIChatController';

interface AIAgentLoaderProps {
    agentName?: string;
    status?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

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
        <div className={`flex items-center gap-3 ${className}`}>
            {/* avatar + pulse ring */}
            <div className="relative flex-shrink-0">
                <div
                    className={`rounded-full bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300 shadow-md`}
                    style={{ width: `${dims.avatar}rem`, height: `${dims.avatar}rem` }}
                    aria-hidden
                />
                <span
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{ boxShadow: '0 0 0 6px rgba(59, 130, 246, 0.06)' }}
                />
            </div>

            {/* text area + animated dots */}
            <div>
                <div className="flex items-center gap-3">
                    <div>
                        <div className={`${dims.text} leading-snug font-medium text-gray-900`}>
                            {agentName}
                        </div>
                        <div className="sr-only" aria-live="polite">
                            {status}
                        </div>
                    </div>

                    {/* animated dots box */}
                    <div
                        className="flex items-center gap-1 rounded-2xl bg-gray-50 px-3 py-1"
                        role="status"
                        aria-hidden={false}
                    >
                        <span
                            className="loader-dot"
                            style={{ width: `${dims.dots / 2}rem`, height: `${dims.dots / 2}rem` }}
                        />
                        <span
                            className="loader-dot"
                            style={{ width: `${dims.dots / 2}rem`, height: `${dims.dots / 2}rem` }}
                        />
                        <span
                            className="loader-dot"
                            style={{ width: `${dims.dots / 2}rem`, height: `${dims.dots / 2}rem` }}
                        />
                    </div>
                </div>

                {/* status text */}
                <div className={`mt-1 ${dims.text} text-gray-500`}>{status}</div>
            </div>

            {/* local styles for the smooth bouncing dots */}
            <style>{`
        .loader-dot {
          display: inline-block;
          background: linear-gradient(90deg, rgba(59,130,246,1) 0%, rgba(96,165,250,1) 50%, rgba(147,197,253,1) 100%);
          border-radius: 9999px;
          transform-origin: center;
          animation: loader-jump 1s infinite ease-in-out;
        }
        .loader-dot:nth-child(2) { animation-delay: 0.15s; }
        .loader-dot:nth-child(3) { animation-delay: 0.3s; }

        @keyframes loader-jump {
          0% { transform: translateY(0) scale(1); opacity: 0.95; }
          30% { transform: translateY(-6px) scale(1.08); opacity: 1; }
          60% { transform: translateY(0) scale(1); opacity: 0.95; }
          100% { transform: translateY(0) scale(1); opacity: 0.95; }
        }
      `}</style>
        </div>
    );
}

const UserMessageRender = (props: { message: IMessages; index: number }) => {
    return (
        <div
            key={props.index}
            className={`ml-auto max-w-xs self-end rounded-lg bg-blue-500 px-4 py-2 text-white`}
        >
            {props.message.content}
        </div>
    );
};

const AIMessageRender = (props: { message: IMessages; index: number }) => {
    return (
        <div
            key={props.index}
            className={`mr-auto max-w-xs self-start rounded-lg bg-gray-200 px-4 py-2 text-gray-800`}
        >
            <ReactMarkdown>{props.message.content}</ReactMarkdown>
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
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
            {props.messages.map((message, index) => (
                <>
                    <IndividualMessageRender message={message} index={index} />
                </>
            ))}
            {props.thinking ? <AIAgentLoader status={props.thinking.verbose_name} /> : null}
        </div>
    );
};

export interface IChatWidgetProps {
    messages: IMessages[],
    thinking: IAIThinking | undefined,
    sessions: IAISession[],
    currSession: number,
    agents: IAIAgentData[],
    selectAIAgent: (agentId: string) => void,
    setCurrSession: (currSession: number) => void,
    sendMessage: (message: string) => void
}

const ChatWidget = (props: IChatWidgetProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [panelWidth, setPanelWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);

    const [input, setInput] = useState('');

    const toggleChat = () => setIsOpen(!isOpen);

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

    const selectAIAgent = (e: React.ChangeEvent<HTMLSelectElement>) => {
        props.selectAIAgent(e.target.value);
    }

    const setCurrSession = (e: React.ChangeEvent<HTMLSelectElement>) => {
        props.setCurrSession(parseInt(e.target.value));
    }

    const sendMessage = () => {
        props.sendMessage(input);
        setInput("");
    }

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
                            {props.agents.length > 1 ? (
                                <select onChange={selectAIAgent}>
                                    {props.agents.map((currAgent) => (
                                        <option value={currAgent.internal_name}>
                                            {currAgent.external_name}
                                        </option>
                                    ))}
                                </select>
                            ) : null}
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
                        <MessagesRender messages={props.messages} thinking={props.thinking} />

                        {/* Input */}
                        <select
                            value={props.currSession}
                            onChange={setCurrSession}
                        >
                            {props.sessions.map((element) => (
                                <option value={element.id}>{element.name}</option>
                            ))}
                        </select>
                        <div className="flex items-center space-x-2 border-t p-4 text-gray-400">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter'}
                                className="flex-1 rounded-lg border px-4 py-2 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Ask me anything..."
                            />
                            <Button displayName="Send" onClick={sendMessage} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;
