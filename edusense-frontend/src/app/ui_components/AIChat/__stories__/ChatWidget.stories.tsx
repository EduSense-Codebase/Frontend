import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ChatWidget from '../index';
'use client';

import { IMessages, IAIThinking } from '../index';
import { IAISession } from '@/app/typedef';

const meta: Meta<typeof ChatWidget> = {
    title: 'Components/ChatWidget',
    component: ChatWidget,
    parameters: {
        layout: 'centered',
    },
};

export default meta;

type Story = StoryObj<typeof ChatWidget>;

const mockMessages: IMessages[] = [
    { sender: 'ai', content: 'Hi! Edusense AI here, how can I help?' },
    { sender: 'user', content: 'Can you explain this concept to me?' },
];


const mockThinking: IAIThinking = {
    step: 2,
    verbose_name: 'Thinking of a great response...',
};

const mockSessions: IAISession[] = [
    {id: 0, name: 'Help with Fractions'},
    {id: 1, name: 'The Great Gatsby Analyisis'},
    {id: 2, name: 'Homework Help'}
]

export const Primary: Story = {
    args: {
        messages: mockMessages,
        thinking: mockThinking,
        sessions: mockSessions
    },
};

export const Secondary: Story = {
    args: {
        messages: [...mockMessages, {sender:"ai", content:"Sure!"}],
    },
};