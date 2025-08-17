/*
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ChatWidget from '../index';
('use client');

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

const syllabus = `
# Course Syllabus

## Week 1
- Introduction to Programming
- **Topics:** Variables, Data Types, Input/Output

## Week 2
- Control Flow
- Loops and Conditionals

## Headers

# This is a Heading h1
## This is a Heading h2
###### This is a Heading h6

## Emphasis

*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
* Item 2a
* Item 2b
    * Item 3a
    * Item 3b

### Ordered

1. Item 1
2. Item 2
3. Item 3
    1. Item 3a
    2. Item 3b

## Images

![Sample Image](/banner1.jpg "Sample Image")

## Links

Link to [Edusense Github](https://github.com/EduSense-Codebase).

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Tables

| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |

`;

const mockMessages2: IMessages[] = [
    { sender: 'ai', content: 'Hi! Edusense AI here, how can I help?' },
    { sender: 'user', content: 'Can you explain this concept to me?' },
    { sender: 'ai', content: syllabus },
];

const mockThinking: IAIThinking = {
    step: 2,
    verbose_name: 'Thinking of a great response...',
};

const mockSessions: IAISession[] = [
    { id: 0, name: 'Help with Fractions' },
    { id: 1, name: 'The Great Gatsby Analyisis' },
    { id: 2, name: 'Homework Help' },
];

export const Primary: Story = {
    args: {
        messages: mockMessages,
        thinking: mockThinking,
        sessions: mockSessions,
    },
};

export const Secondary: Story = {
    args: {
        messages: mockMessages2,
    },
};
*/

export default function Test() {}
