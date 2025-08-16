'use client';
import React, { useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import Button from '../Button';
import { API_PREFIX, WS_API_PREFIX, WS_AI_AGENT_ENDPOINT, AUTH_ENDPOINT } from '../../global';
import "./ChatWidget.scss";

import { httpGet, httpPost } from '../../utils';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import {
    IAIAgentData,
    IAIAgentsResponse,
    IAIJwtTokenRespose,
    IAISession,
    IFetchAllAISessions,
} from '../../typedef';
import { createAIConnection } from './websocket';

export interface IMessages {
    sender: 'user' | 'ai';
    content?: string;
}

interface IAIStreamProgress {
    step: number;
    verbose_name: string;
}

interface IAIStream {
    type: 'progress' | 'final_content';
    progress_data?: IAIStreamProgress;
    final_content?: string;
}

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
            <img src="/chat-icon.svg" alt="chatbot icon" className='chat-message-icon'/>
            
            {/* text area + animated dots */}
            <div>
                <div className="flex-col items-center mt-4 gap-3">
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
                        <span className="loader-dot" style={{ width: '0.5rem', height: '0.5rem' }} />
                        <span className="loader-dot" style={{ width: '0.5rem', height: '0.5rem' }} />
                        <span className="loader-dot" style={{ width: '0.5rem', height: '0.5rem' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

const UserMessageRender = (props: { message: IMessages; index: number }) => {
    return (
        <div
            key={props.index}
            className="user-message"
        >
            {props.message.content}
        </div>
    );
};

const AIMessageRender = (props: { message: IMessages; index: number }) => {
    return (
        <div className="ai-message-container">
            <img src="/chat-icon.svg" alt="chatbot icon" className='chat-message-icon'/>
            <div key={props.index} className="ai-message">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                >
                    {props.message.content}
                </ReactMarkdown>
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
                <>
                    <IndividualMessageRender message={message} index={index} />
                </>
            ))}
            {props.thinking ? <AIAgentLoader status={props.thinking.verbose_name} /> : null}
        </div>
    );
};

export interface IAIThinking {
    step: number;
    verbose_name: string;
}

export interface IChatWidgetProps {
    courseId?: number;
    messages?: IMessages[];
    thinking?: IAIThinking;
    sessions?: IAISession[];
}

const ChatWidget : React.FC<IChatWidgetProps> = ({
    courseId = 0,
    messages = [],
    thinking = undefined,
    sessions = []
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [panelWidth, setPanelWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);

    //const [messages, setMessages] = useState<IMessages[]>([]);
    //const [thinking, setThinking] = useState<IAIThinking | undefined>(undefined);
    const [input, setInput] = useState('');

    //const [sessions, setSessions] = useState<IAISession[]>([]);
    const [currSession, setCurrSession] = useState<number>(0);

    const [agents, setAgents] = useState<IAIAgentData[]>([]);
    const [currAgent, setCurrAgent] = useState<string | undefined>(undefined);

    const [websocketConn, setWebsocketConn] = useState<ReturnType<
        typeof createAIConnection
    > | null>(null);

    const toggleChat = () => {
        if (isOpen) { setSidebarOpen(false) }  // close sidebar
        setIsOpen(!isOpen)
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

    useEffect(() => {
        document.body.style.userSelect = isResizing ? 'none' : 'auto';
    }, [isResizing]);

    useEffect(() => {
        let queryParams = {
            section: 'get_ai_agents',
        };

        const getAgents = httpGet<IAIAgentsResponse>(`${API_PREFIX}${AUTH_ENDPOINT}`, queryParams);

        getAgents.then((response) => {
            setAgents(response.data.data);
            setCurrAgent(response.data.data[0].internal_name);
        });
    }, []);
    /*
    useEffect(() => {
        if (props.courseId && currAgent) {
            let sessionQueryParams = {
                section: 'ai_sessions',
                course_id: props.courseId,
            };
            const getAllSessions = httpGet<IFetchAllAISessions>(
                `${API_PREFIX}${AUTH_ENDPOINT}`,
                sessionQueryParams,
            );
            getAllSessions
                .then((response) => {
                    setSessions(response.data.data);
                    setWebsocketConn(() => {
                        const conn = createAIConnection(props.courseId, currSession, currAgent);

                        conn.on('open', () => {
                            console.log('Socket Connected!');
                            conn.sendRequestToGetMessage();
                        });

                        conn.on('message', onAIMessage);

                        conn.connect();

                        return conn;
                    });
                })
                .catch((e) => {
                    console.log('Fetching AI Sessions Failed');
                    throw e;
                });
        }

        return () => {
            websocketConn?.disconnect();
        };
    }, [props.courseId, currSession, currAgent]);

    const sendMessage = () => {
        if (websocketConn != null) {
            websocketConn.sendMessage(input);

            setMessages((currMessages) => {
                return [
                    ...currMessages,
                    {
                        sender: 'user',
                        content: input,
                    },
                ];
            });

            setInput('');
        }
    };

    const onAIMessage = (msg: string) => {
        const jsonMsg = JSON.parse(msg);
        if (jsonMsg.type == 'conversation_history') {
            setMessages(jsonMsg.messages);
        } else if (jsonMsg.type == 'progress') {
            const progressData: IAIThinking = jsonMsg.progress_data;
            setThinking((prevThinking) => {
                if (!prevThinking) {
                    return progressData;
                }
                if (prevThinking.step < progressData.step) {
                    return progressData;
                }
                return prevThinking;
            });
        } else if (jsonMsg.type == 'final_content') {
            const aiMessage: string = jsonMsg.final_content;
            setThinking(undefined);
            setMessages((prevMessages) => {
                return [...prevMessages, { sender: 'ai', content: aiMessage }];
            });
        } else if (jsonMsg.type == 'stream_final_content') {
            setThinking(undefined);
            console.log(jsonMsg.chunk);
            const aiMessage: string = jsonMsg.chunk;
            setThinking(undefined);
            setMessages((prevMessages) => {
                const lastMessage = prevMessages[prevMessages.length - 1];
                if (lastMessage.sender == 'user') {
                    return [...prevMessages, { sender: 'ai', content: aiMessage }];
                } else if (lastMessage.sender == 'ai') {
                    const restOfArray = prevMessages.slice(0, -1);
                    return [
                        ...restOfArray,
                        { sender: 'ai', content: lastMessage.content + ' ' + aiMessage },
                    ];
                }
                return [];
            });
        }
    };*/

    const selectAIAgent = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrAgent(e.target.value);
    };

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedMode, setSelectedMode] = useState('Conversational');

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }
    

    return (
        <div className="chat-window">
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
                    <div className="relative h-6 w-6 scale-180 top-[-4px]">
                        <Image
                            src="/chat-icon-light.svg"
                            alt="Chat Icon"
                            fill
                            className="object-contain"
                        />                    </div>
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
                                    <img src="/menu.svg" alt="menu icon" className="sidebar-menu"/>
                                </button>
                                <h2> EduSense AI Chat </h2>
                                {agents.length > 1 ? (
                                    <select onChange={selectAIAgent}>
                                        {agents.map((currAgent) => (
                                            <option value={currAgent.internal_name}>
                                                {currAgent.external_name}
                                            </option>
                                        ))}
                                    </select>
                                ) : null}
                                <button onClick={toggleChat}>
                                    <img src="/forward-arrow.svg" alt="go back" className="arrow-icon"/>
                                </button>
                            </div>
                            <div className="chat-body">
                                <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                                    <button className="new-session">
                                        <img src="/blue-plus.png" alt="plus icon" className="add-btn"/>
                                        <h3>New Session</h3>
                                    </button>
                                    <div className='sessions-wrapper'>
                                        <h3>Sessions</h3>
                                        <div className='sessions-container'>
                                            {(sessions.length > 0) ? (
                                                sessions.map((session:IAISession) => (
                                                    <div className='session' onClick={()=>setCurrSession(session.id)}>
                                                        <p>{session.name}</p>
                                                    </div>
                                                ))) : (
                                                    <div className='session'>
                                                        <p>No sessions yet.</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                <MessagesRender messages={messages} thinking={thinking} />
                            </div>


                        {/* Input */}
                        <div className="chat-footer">
                            <div className="chat-footer-input">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter'}
                                    className="flex-1 rounded-lg border px-4 py-2 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Ask me anything..."
                                />
                                <button onClick={()=>console.log("message sent")} className="send-icon">
                                    <img src="/airplane.svg" alt="send"/>
                                </button>
                            </div>
                            <div className="select-mode">
                                <p>Mode: </p>
                                <div className='mode-btns'>
                                    <button
                                        className={`mode-btn ${selectedMode === 'Conversational' ? 'selected' : ''}`}
                                        onClick={() => setSelectedMode('Conversational')}> Conversational </button>
                                    <p>|</p>
                                    <button
                                    className={`mode-btn ${selectedMode === 'Content Gen' ? 'selected' : ''}`}
                                    onClick={() => setSelectedMode('Content Gen')}> Content Gen </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatWidget;
