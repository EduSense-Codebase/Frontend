import React from 'react';
import { useState } from 'react';
import type { StoryObj, Meta } from '@storybook/nextjs-vite';
import ShortAnswerQ, { CorrectAnswer } from '../index';
import { QuestionType } from '../../AssignmentBuilder';
import { Mode } from '../../MultipleChoiceQ/index';

const meta: Meta<typeof ShortAnswerQ> = {
    title: 'Component/ShortAnswerQ',
    component: ShortAnswerQ,
};

export default meta;

type Story = StoryObj<typeof ShortAnswerQ>;

export const Primary: Story = {
    render: () => {
        const [correctAnswers, setCorrectAnswers] = useState<CorrectAnswer[]>([
            { id: '1', text: 'Berlin' },
            { id: '2', text: 'berlin' },
            { id: '3', text: 'BERLIN' },
        ]);
        const [mode, setMode] = useState<Mode>('view');
        const [question, setQuestion] = useState('What is the capital of Germany?');
        const [answer, setAnswer] = useState('');
        const [isRequired, setIsRequired] = useState(false);
        const [qType, setQType] = useState<QuestionType>('short');
        const [points, setPoints] = useState<number>(10);

        const handleChangeQType = (newType: QuestionType) => {
            setQType(newType);
        };

        const handleAddAnswer = () => {
            setCorrectAnswers([...correctAnswers, { id: Date.now().toString(), text: '' }]);
        };

        const handleRemoveAnswer = (id: string) => {
            setCorrectAnswers(correctAnswers.filter((ans) => ans.id !== id));
        };

        const handleChangeAnswerText = (id: string, value: string) => {
            setCorrectAnswers(
                correctAnswers.map((ans) => (ans.id === id ? { ...ans, text: value } : ans)),
            );
        };

        const handleToggleRequired = (required: boolean) => {
            setIsRequired(required);
        };

        return (
            <ShortAnswerQ
                mode={mode}
                question={question}
                correctAnswers={correctAnswers}
                onChangeCorrectAnswerText={handleChangeAnswerText}
                onRemoveCorrectAnswer={handleRemoveAnswer}
                onAddCorrectAnswer={handleAddAnswer}
                answer={answer}
                onChangeAnswer={setAnswer}
                onChangeQuestion={setQuestion}
                isRequired={isRequired}
                onToggleRequired={handleToggleRequired}
                onSave={() => setMode('view')}
                onChangeQType={handleChangeQType}
                qType={qType}
                onChangePoints={(newPoints) => setPoints(newPoints)}
                points={points}
            />
        );
    },
};

export const Secondary: Story = {
    render: () => {
        const [correctAnswers, setCorrectAnswers] = useState<CorrectAnswer[]>([
            { id: '1', text: 'Berlin' },
            { id: '2', text: 'berlin' },
            { id: '3', text: 'BERLIN' },
        ]);
        const [mode, setMode] = useState<Mode>('edit');
        const [question, setQuestion] = useState('What is the capital of Germany?');
        const [answer, setAnswer] = useState('');
        const [isRequired, setIsRequired] = useState(false);
        const [qType, setQType] = useState<QuestionType>('short');
        const [points, setPoints] = useState<number>(10);

        const handleChangeQType = (newType: QuestionType) => {
            setQType(newType);
        };

        const handleAddAnswer = () => {
            setCorrectAnswers([...correctAnswers, { id: Date.now().toString(), text: '' }]);
        };

        const handleRemoveAnswer = (id: string) => {
            setCorrectAnswers(correctAnswers.filter((ans) => ans.id !== id));
        };

        const handleChangeAnswerText = (id: string, value: string) => {
            setCorrectAnswers(
                correctAnswers.map((ans) => (ans.id === id ? { ...ans, text: value } : ans)),
            );
        };

        const handleToggleRequired = (required: boolean) => {
            setIsRequired(required);
        };

        return (
            <ShortAnswerQ
                mode={mode}
                question={question}
                correctAnswers={correctAnswers}
                onChangeCorrectAnswerText={handleChangeAnswerText}
                onRemoveCorrectAnswer={handleRemoveAnswer}
                onAddCorrectAnswer={handleAddAnswer}
                answer={answer}
                onChangeAnswer={setAnswer}
                onChangeQuestion={setQuestion}
                isRequired={isRequired}
                onToggleRequired={handleToggleRequired}
                onSave={() => setMode('view')}
                qType={qType}
                onChangeQType={handleChangeQType}
                onChangePoints={(newPoints) => setPoints(newPoints)}
                points={points}
            />
        );
    },
};

export const GradeView: Story = {
    render: () => {
        const [correctAnswers, setCorrectAnswers] = useState<CorrectAnswer[]>([
            { id: '1', text: 'Berlin' },
            { id: '2', text: 'berlin' },
            { id: '3', text: 'BERLIN' },
        ]);
        const [mode, setMode] = useState<Mode>('grade-view');
        const [question, setQuestion] = useState('What is the capital of Germany?');
        const [answer, setAnswer] = useState('');
        const [isRequired, setIsRequired] = useState(false);
        const [qType, setQType] = useState<QuestionType>('short');
        const [points, setPoints] = useState<number>(10);
        const studentAnswer = "i don't know";

        const handleChangeQType = (newType: QuestionType) => {
            setQType(newType);
        };

        const handleAddAnswer = () => {
            setCorrectAnswers([...correctAnswers, { id: Date.now().toString(), text: '' }]);
        };

        const handleRemoveAnswer = (id: string) => {
            setCorrectAnswers(correctAnswers.filter((ans) => ans.id !== id));
        };

        const handleChangeAnswerText = (id: string, value: string) => {
            setCorrectAnswers(
                correctAnswers.map((ans) => (ans.id === id ? { ...ans, text: value } : ans)),
            );
        };

        const handleToggleRequired = (required: boolean) => {
            setIsRequired(required);
        };

        return (
            <ShortAnswerQ
                mode={mode}
                question={question}
                correctAnswers={correctAnswers}
                onChangeCorrectAnswerText={handleChangeAnswerText}
                onRemoveCorrectAnswer={handleRemoveAnswer}
                onAddCorrectAnswer={handleAddAnswer}
                answer={answer}
                onChangeAnswer={setAnswer}
                onChangeQuestion={setQuestion}
                isRequired={isRequired}
                onToggleRequired={handleToggleRequired}
                onSave={() => setMode('view')}
                qType={qType}
                onChangeQType={handleChangeQType}
                onChangePoints={(newPoints) => setPoints(newPoints)}
                studentAnswer={studentAnswer}
                points={points}
                feedback={['Wrong! The correct answer is Berlin.', 'Remember, it starts with a B.']}
            />
        );
    },
};

export const GradeEdit: Story = {
    render: () => {
        const [correctAnswers, setCorrectAnswers] = useState<CorrectAnswer[]>([
            { id: '1', text: 'Berlin' },
            { id: '2', text: 'berlin' },
            { id: '3', text: 'BERLIN' },
        ]);
        const [mode, setMode] = useState<Mode>('grade-edit');
        const [question, setQuestion] = useState('What is the capital of Germany?');
        const [answer, setAnswer] = useState('');
        const [isRequired, setIsRequired] = useState(false);
        const [qType, setQType] = useState<QuestionType>('short');
        const [points, setPoints] = useState<number>(10);
        const [feedback, setFeedback] = useState<string[]>(["That's correct! Good job."]);
        const studentAnswer = 'berlin';

        const handleChangeQType = (newType: QuestionType) => {
            setQType(newType);
        };

        const handleAddAnswer = () => {
            setCorrectAnswers([...correctAnswers, { id: Date.now().toString(), text: '' }]);
        };

        const handleRemoveAnswer = (id: string) => {
            setCorrectAnswers(correctAnswers.filter((ans) => ans.id !== id));
        };

        const handleChangeAnswerText = (id: string, value: string) => {
            setCorrectAnswers(
                correctAnswers.map((ans) => (ans.id === id ? { ...ans, text: value } : ans)),
            );
        };

        const handleToggleRequired = (required: boolean) => {
            setIsRequired(required);
        };

        return (
            <ShortAnswerQ
                mode={mode}
                question={question}
                correctAnswers={correctAnswers}
                onChangeCorrectAnswerText={handleChangeAnswerText}
                onRemoveCorrectAnswer={handleRemoveAnswer}
                onAddCorrectAnswer={handleAddAnswer}
                answer={answer}
                onChangeAnswer={setAnswer}
                onChangeQuestion={setQuestion}
                isRequired={isRequired}
                onToggleRequired={handleToggleRequired}
                onSave={() => setMode('view')}
                qType={qType}
                onChangeQType={handleChangeQType}
                onChangePoints={(newPoints) => setPoints(newPoints)}
                points={points}
                feedback={feedback}
                onChangeFeedback={(newFeedback) => {
                    setFeedback(newFeedback);
                }}
                studentAnswer={studentAnswer}
            />
        );
    },
};

//export default function Test() {}
