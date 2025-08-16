import React from 'react';
import type { StoryObj, Meta } from '@storybook/nextjs-vite';
import AssignmentBuilder from '../index';
import { Question } from '../index';

const meta: Meta<typeof AssignmentBuilder> = {
    title: 'Component/AssignmentBuilder',
    component: AssignmentBuilder,
};

export default meta;

type Story = StoryObj<typeof AssignmentBuilder>;

const primaryQuizQuestions: Question[] = [
  {
    id: 'q1',
    type: 'Multiple Choice',
    question: 'Which planet is known as the Red Planet?',
    description: 'Select the correct answer from the options below.',
    isRequired: true,
    mode: 'view',
    options: [
      { id: 'o1', text: 'Earth' },
      { id: 'o2', text: 'Mars', isCorrect: true },
      { id: 'o3', text: 'Jupiter' },
      { id: 'o4', text: 'Venus' }
    ]
  },
  {
    id: 'q2',
    type: 'Short Answer',
    question: 'What is the chemical symbol for water?',
    isRequired: true,
    mode: 'view',
    answer: '',
    correctAnswers: [
      { id: 'a1', text: 'H2O' },
      { id: 'a2', text: 'h2o' }
    ]
  },
  {
    id: 'q3',
    type: 'Long Answer',
    question: 'Explain the process of photosynthesis.',
    description: 'Your explanation should include the role of chlorophyll and sunlight.',
    isRequired: false,
    mode: 'view'
  }
];

export const Primary: Story = {
    render: () => (
        <AssignmentBuilder
            quizQuestions={primaryQuizQuestions}
            title="Practice Quiz"
            description="Test your science knowledge!"
        />
    ),
};

export const Secondary: Story = {
    render: () => (
        <AssignmentBuilder
            quizQuestions={[]}
            title="Empty Quiz"
            description="Write a description here..."
        />
    ),
};
