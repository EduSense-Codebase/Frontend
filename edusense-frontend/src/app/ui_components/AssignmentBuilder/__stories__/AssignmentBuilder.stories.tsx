import React from 'react';
import type { StoryObj, Meta } from '@storybook/nextjs-vite';
import AssignmentBuilder from '../index';
import { Question } from '../index';
import { useState } from 'react';

const meta: Meta<typeof AssignmentBuilder> = {
    title: 'Component/AssignmentBuilder',
    component: AssignmentBuilder,
};

export default meta;

type Story = StoryObj<typeof AssignmentBuilder>;

const primaryQuizQuestions: Question[] = [
    {
        id: 'q1',
        type: 'multiple',
        question: 'Which planet is known as the Red Planet?',
        description: 'Select the correct answer from the options below.',
        isRequired: true,
        mode: 'view',
        options: [
            { id: 'o1', text: 'Earth' },
            { id: 'o2', text: 'Mars', isCorrect: true },
            { id: 'o3', text: 'Jupiter' },
            { id: 'o4', text: 'Venus' },
        ],
        orderIndex: 0,
        points: 5,
        selectedOptionId: 'o2',
        feedback: ['Correct! Mars is known as the Red Planet.'],
    },
    {
        id: 'q2',
        type: 'short',
        question: 'What is the chemical symbol for water?',
        isRequired: true,
        mode: 'view',
        answer: 'Test Answer',
        correctAnswers: [
            { id: 'a1', text: 'H2O' },
            { id: 'a2', text: 'h2o' },
        ],
        orderIndex: 1,
        points: 5,
        feedback: ['This is some feedback'],
        isCorrect: true,
    },
    {
        id: 'q3',
        type: 'long',
        question: 'Explain the process of photosynthesis.',
        description: 'Your explanation should include the role of chlorophyll and sunlight.',
        isRequired: false,
        mode: 'view',
        orderIndex: 2,
        file: new File([], 'example.txt'),
        feedback: ['Good explanation! You covered the key points of photosynthesis.'],
        points: 10,
    },
];

export const Primary: Story = {
    render: () => {
        const [title, setTitle] = useState('Practice Quiz');
        const [description, setDescription] = useState('"Test your science knowledge!"');

        const onQuizChange = (newQuestions: Question[]) => {
            console.log(newQuestions);
        };

        const onAnswerSelection = (questionIndex: number, value?: string | number | File) => {
            console.log(`Question Index: ${questionIndex}`);
            console.log(`Value: ${value}`);

            console.log(value);
        };

        const onQuizSubmit = () => {
            console.log('Quiz Submit');
        };

        return (
            <AssignmentBuilder
                quizQuestions={primaryQuizQuestions}
                title={title}
                description={description}
                allowEdit={false}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onQuizChange={onQuizChange}
                onAnswerSelection={onAnswerSelection}
                onSubmit={onQuizSubmit}
                mode={'view'}
            />
        );
    },
};

export const Edit: Story = {
    render: () => {
        const [title, setTitle] = useState('Practice Quiz');
        const [description, setDescription] = useState('"Test your science knowledge!"');

        const onQuizChange = (newQuestions: Question[]) => {
            console.log(newQuestions);
        };

        const onAnswerSelection = (questionIndex: number, value?: string | number | File) => {
            console.log(`Question Index: ${questionIndex}`);
            console.log(`Value: ${value}`);

            console.log(value);
        };

        const onQuizSubmit = () => {
            console.log('Quiz Submit');
        };

        return (
            <AssignmentBuilder
                quizQuestions={primaryQuizQuestions}
                title={title}
                description={description}
                allowEdit={true}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onQuizChange={onQuizChange}
                onAnswerSelection={onAnswerSelection}
                onSubmit={onQuizSubmit}
                mode={'edit'}
            />
        );
    },
};

export const GradeView: Story = {
    render: () => {
        const [title, setTitle] = useState('Practice Quiz');
        const [description, setDescription] = useState('"Test your science knowledge!"');

        const onQuizChange = (newQuestions: Question[]) => {
            console.log(newQuestions);
        };

        const onAnswerSelection = (questionIndex: number, value?: string | number | File) => {
            console.log(`Question Index: ${questionIndex}`);
            console.log(`Value: ${value}`);

            console.log(value);
        };

        const onQuizSubmit = () => {
            console.log('Quiz Submit');
        };

        return (
            <AssignmentBuilder
                quizQuestions={primaryQuizQuestions}
                title={title}
                description={description}
                allowEdit={false}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onQuizChange={onQuizChange}
                onAnswerSelection={onAnswerSelection}
                onSubmit={onQuizSubmit}
                mode={'grade-view'}
            />
        );
    },
};

export const GradeEdit: Story = {
    render: () => {
        const [title, setTitle] = useState('Practice Quiz');
        const [description, setDescription] = useState('"Test your science knowledge!"');

        const onQuizChange = (newQuestions: Question[]) => {
            console.log(newQuestions);
        };

        const onAnswerSelection = (questionIndex: number, value?: string | number | File) => {
            console.log(`Question Index: ${questionIndex}`);
            console.log(`Value: ${value}`);

            console.log(value);
        };

        const onQuizSubmit = () => {
            console.log('Quiz Submit');
        };

        return (
            <AssignmentBuilder
                quizQuestions={primaryQuizQuestions}
                title={title}
                description={description}
                allowEdit={false}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onQuizChange={onQuizChange}
                onAnswerSelection={onAnswerSelection}
                onSubmit={onQuizSubmit}
                mode={'grade-edit'}
                studentName={'John Doe'}
                gradedPoints={95}
                totalPoints={100}
                submissionNumber={3}
                totalSubmissions={8}
            />
        );
    },
};

//export default function Test() {}
