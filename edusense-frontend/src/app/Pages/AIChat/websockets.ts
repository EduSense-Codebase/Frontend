import { API_PREFIX, AUTH_ENDPOINT, WS_AI_AGENT_ENDPOINT, WS_API_PREFIX } from '@/app/global';
import { IAIJwtTokenRespose } from '@/app/typedef';
import { httpPost } from '@/app/utils';

export const createAIConnection = (
    courseId: number | undefined,
    builderId: number | undefined,
    sessionId: number,
    agentName: string,
) => {
    let socket: WebSocket | null = null;
    let isConnected = false;

    // Store event listeners internally
    const listeners: {
        message: ((data: string) => void)[];
        open: (() => void)[];
        close: (() => void)[];
        error: ((err: Event) => void)[];
    } = { message: [], open: [], close: [], error: [] };

    const connect = () => {
        if (isConnected) return;

        let createAiSessionQueryParams = {
            section: 'connect_ai_session',
        };

        let formData = {
            course_id: courseId,
            session_id: sessionId,
        };

        httpPost<IAIJwtTokenRespose>(
            `${API_PREFIX}${AUTH_ENDPOINT}`,
            formData,
            createAiSessionQueryParams,
        ).then((data) => {
            socket = new WebSocket(`${WS_API_PREFIX}${WS_AI_AGENT_ENDPOINT}${data.data.jwt}`);

            socket.onopen = () => {
                isConnected = true;
                listeners.open.forEach((fn) => fn());
            };

            socket.onmessage = (event) => {
                listeners.message.forEach((fn) => fn(event.data));
            };

            socket.onclose = () => {
                isConnected = false;
                listeners.close.forEach((fn) => fn());
            };

            socket.onerror = (err) => {
                listeners.error.forEach((fn) => fn(err));
            };
        });
    };

    const sendMessage = (msg: string) => {
        if (socket && isConnected) {
            let agentQuery = {
                type: 'send_message',
                query: msg,
                course_id: courseId,
                builder_id: builderId,
                session_id: sessionId,
                agent: agentName,
            };
            socket.send(JSON.stringify(agentQuery));
        } else {
            console.warn('🚫 Cannot send message — not connected');
        }
    };

    const sendRequestToGetMessage = () => {
        if (socket && isConnected) {
            let agentQuery = {
                type: 'retrieve_message',
                course_id: courseId,
                session_id: sessionId,
                agent: agentName,
            };
            socket.send(JSON.stringify(agentQuery));
        }
    };

    const disconnect = () => {
        if (socket) {
            socket.close();
            socket = null;
            isConnected = false;
        }
    };

    const on = (
        event: 'message' | 'open' | 'close' | 'error',
        handler: (...args: any[]) => void,
    ) => {
        listeners[event].push(handler);
    };

    return {
        connect,
        sendMessage,
        sendRequestToGetMessage,
        disconnect,
        on,
    };
};
