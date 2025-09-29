'use client';

import { API_PREFIX, AUTH_ENDPOINT } from '@/app/global';
import { IAIAgentData, IAIAgentsResponse, IAISession, IFetchAllAISessions } from '@/app/typedef';
import { httpGet } from '@/app/utils';
import { useEffect, useState } from 'react';
import { createAIConnection } from './websockets';
import ChatWidget from '@/app/ui_components/AIChat';
import toast from 'react-hot-toast';

export interface IMessages {
    sender: 'user' | 'ai';
    content?: string;
}

export interface IAIStreamProgress {
    step: number;
    verbose_name: string;
}

export interface IAIStream {
    type: 'progress' | 'final_content';
    progress_data?: IAIStreamProgress;
    final_content?: string;
}

export interface IAIThinking {
    step: number;
    verbose_name: string;
}

export interface AIChatControllerProps {
    courseId?: number;
    builderId?: number;
}

export default function AIChatController(props: AIChatControllerProps) {
    const [messages, setMessages] = useState<IMessages[]>([]);
    const [thinking, setThinking] = useState<IAIThinking | undefined>(undefined);

    const [sessions, setSessions] = useState<IAISession[]>([]);
    const [currSession, setCurrSession] = useState<number>(0);

    const [agents, setAgents] = useState<IAIAgentData[]>([]);
    const [currAgent, setCurrAgent] = useState<string | undefined>(undefined);

    const [websocketConn, setWebsocketConn] = useState<ReturnType<
        typeof createAIConnection
    > | null>(null);

    useEffect(() => {
        if (props.courseId) {
            const queryParams = {
                course_id: props.courseId,
                section: 'get_ai_agents',
            };

            const getAgents = httpGet<IAIAgentsResponse>(`${API_PREFIX}${AUTH_ENDPOINT}`, queryParams);

            getAgents.then((response) => {
                setAgents(response.data.data);
                setCurrAgent(response.data.data[0].internal_name);
            });
        }
    }, [props.courseId]);

    useEffect(() => {
        if (props.courseId && currAgent) {
            const sessionQueryParams = {
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
                        const conn = createAIConnection(
                            props.courseId,
                            props.builderId,
                            currSession,
                            currAgent,
                        );

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
    }, [props.courseId, props.builderId, currSession, currAgent]);

    const sendMessage = (input: string) => {
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
            toast.success('Content generation complete!');
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
    };

    const selectAIAgent = (agentId: string) => {
        setCurrAgent(agentId);
    };

    const createNewSession = () => {};

    return (
        <ChatWidget
            messages={messages}
            thinking={thinking}
            sessions={sessions}
            currSession={currSession}
            currAgent={currAgent}
            agents={agents}
            selectAIAgent={selectAIAgent}
            setCurrSession={setCurrSession}
            sendMessage={sendMessage}
            createNewSession={createNewSession}
        />
    );
}
