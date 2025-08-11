'use client';
import React, { useEffect, useState } from 'react';
import Button from '../Button';
import { AI_ENDPOINT, API_PREFIX, WS_API_PREFIX, WS_AI_AGENT_ENDPOINT, AUTH_ENDPOINT } from '../../global';

import { io, Manager } from "socket.io-client";

import { httpGet, httpPost } from '../../utils';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { IAIJwtTokenRespose, IAISession, IFetchAllAISessions } from '../../typedef';
import { createAIConnection } from './websocket';

interface IMessages {
    sender: 'user' | 'ai',
    content?: string
    progress_information?: {
        currStep: 0,
        display: string[]
    }
}

interface IAIStreamProgress {
    step: number,
    verbose_name: string
}

interface IAIStream {
    type: "progress" | "final_content",
    progress_data?: IAIStreamProgress
    final_content?: string
}

const UserMessageRender = (props: { message: IMessages, index: number }) => {
    return (
        <div key={props.index}
            className={`max-w-xs rounded-lg px-4 py-2 ml-auto self-end bg-blue-500 text-white`}>
                {props.message.content}
        </div>
    )
}

const AIMessageRender = (props: { message: IMessages, index: number }) => {
    return (
        <div key={props.index}
             className={`max-w-xs rounded-lg px-4 py-2 mr-auto self-start bg-gray-200 text-gray-800`}>
                <ReactMarkdown>{props.message.content}</ReactMarkdown>

        </div>
    )
}

const IndividualMessageRender = (props: { message: IMessages, index: number }) => {
    if (props.message.sender === 'user') {
        return <UserMessageRender {...props} />
    }
    return <AIMessageRender {...props} />
}

const MessagesRender = (props: { messages: IMessages[] }) => {
    return (
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
            {props.messages.map((message, index) => (
                <IndividualMessageRender message={message} index={index} />
            ))}
        </div>
    )
}

export interface IChatWidgetProps {
    courseId?: number
}

const ChatWidget = (props: IChatWidgetProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<IMessages[]>([]);
    const [input, setInput] = useState('');
    const [panelWidth, setPanelWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);

    const [sessions, setSessions] = useState<IAISession[]>([]);
    const [currSession, setCurrSession] = useState<number>(0);

    const [websocketConn, setWebsocketConn] = useState<ReturnType<typeof createAIConnection> | null>(null);

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

    useEffect(() => {
        let sessionQueryParams: { section: string, course_id?: number} = {
            section: 'ai_sessions',
        };
        if (props.courseId) {
            sessionQueryParams = {
                ...sessionQueryParams,
                course_id: props.courseId
            };
        }
        const getAllSessions = httpGet<IFetchAllAISessions>(`${API_PREFIX}${AUTH_ENDPOINT}`, sessionQueryParams);
        getAllSessions.then((response) => {
            setSessions(response.data.data);
            setWebsocketConn(() => {
                const conn = createAIConnection(props.courseId, 0, "teacher_agent")

                conn.on("open", () => {
                    console.log("Socket Connected!");
                })

                conn.on("message", onAIMessage);

                conn.connect();

                return conn;
            })
        }).catch((e) => {
            console.log("Fetching AI Sessions Failed");
            throw e;
        })

        return () => {
            websocketConn?.disconnect();
        }
    }, [props.courseId])

    const sendMessage = () => {
        if (websocketConn != null) {
            websocketConn.sendMessage(input);

            setMessages((currMessages) => {
                return [...currMessages, {
                    sender: 'user',
                    content: input
                }]
            })

            setInput("");
        }

    }

    const onAIMessage = (msg: string) => {
        console.log(msg)
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
                        <MessagesRender messages={messages} /> 

                        {/* Input */}
                        <select value={currSession} onChange={(e) => setCurrSession(parseInt(e.target.value))}>
                            {sessions.map(element => <option value={element.id}>{element.name}</option>)}
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
