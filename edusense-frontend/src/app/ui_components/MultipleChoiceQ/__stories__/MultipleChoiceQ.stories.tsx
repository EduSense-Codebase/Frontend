// stories/MultipleChoiceQ.stories.tsx

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MultipleChoiceQ, { Option } from '../index';
import { Mode, QuestionType } from '../../AssignmentBuilder';

const meta: Meta<typeof MultipleChoiceQ> = {
    title: 'Component/MultipleChoiceQ',
    component: MultipleChoiceQ,
};
export default meta;

type Story = StoryObj<typeof MultipleChoiceQ>;

export const Primary: Story = {
    render: () => {
        const [mode, setMode] = useState<Mode>('view');
        const [question, setQuestion] = useState('What is the capital of Germany?');
        const [options, setOptions] = useState<Option[]>([
            { id: '1', text: 'Luxembourg' },
            { id: '2', text: 'Berlin', isCorrect: true },
            { id: '3', text: 'Munich' },
        ]);
        const [isRequired, setIsRequired] = useState(false);
        const [qType, setQType] = useState<QuestionType>('short');
        const [points, setPoints] = useState<number>(10);

        const handleChangeQType = (newType: QuestionType) => {
            setQType(newType);
        };

        const handleAddOption = () => {
            setOptions([...options, { id: Date.now().toString(), text: '' }]);
        };

        const handleRemoveOption = (id: string) => {
            setOptions(options.filter((opt) => opt.id !== id));
        };

        const handleChangeOptionText = (id: string, value: string) => {
            setOptions(options.map((opt) => (opt.id === id ? { ...opt, text: value } : opt)));
        };

        const handleToggleCorrect = (id: string) => {
            setOptions(
                options.map((opt) => (opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt)),
            );
        };

        const handleToggleRequired = (required: boolean) => {
            setIsRequired(required);
        };

        return (
            <MultipleChoiceQ
                mode={mode}
                question={question}
                options={options}
                onChangeQuestion={setQuestion}
                onChangeOptionText={handleChangeOptionText}
                onRemoveOption={handleRemoveOption}
                onAddOption={handleAddOption}
                onToggleCorrect={handleToggleCorrect}
                isRequired={isRequired}
                onToggleRequired={handleToggleRequired}
                onCancel={() => setMode('view')}
                onSave={() => setMode('view')}
                qType={qType}
                onChangeQType={handleChangeQType}
                onAnswerSelect={(index) => console.log(index.toString())}
                onChangePoints={(newPoints) => setPoints(newPoints)}
                points={points}
            />
        );
    },
};

export const Secondary: Story = {
    render: () => {
        const [mode, setMode] = useState<Mode>('edit');
        const [question, setQuestion] = useState('What is the capital of Germany?');
        const [options, setOptions] = useState<Option[]>([
            { id: '1', text: 'Luxembourg' },
            { id: '2', text: 'Berlin', isCorrect: true },
            { id: '3', text: 'Munich' },
        ]);
        const [isRequired, setIsRequired] = useState(false);
        const [qType, setQType] = useState<QuestionType>('short');
        const [points, setPoints] = useState<number>(10);

        const handleChangeQType = (newType: QuestionType) => {
            setQType(newType);
        };

        const handleAddOption = () => {
            setOptions([...options, { id: Date.now().toString(), text: '' }]);
        };

        const handleRemoveOption = (id: string) => {
            setOptions(options.filter((opt) => opt.id !== id));
        };

        const handleChangeOptionText = (id: string, value: string) => {
            setOptions(options.map((opt) => (opt.id === id ? { ...opt, text: value } : opt)));
        };

        const handleToggleCorrect = (id: string) => {
            setOptions(
                options.map((opt) => (opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt)),
            );
        };

        const handleToggleRequired = (required: boolean) => {
            setIsRequired(required);
        };

        return (
            <MultipleChoiceQ
                mode={mode}
                question={question}
                options={options}
                onChangeQuestion={setQuestion}
                onChangeOptionText={handleChangeOptionText}
                onRemoveOption={handleRemoveOption}
                onAddOption={handleAddOption}
                onToggleCorrect={handleToggleCorrect}
                isRequired={isRequired}
                onToggleRequired={handleToggleRequired}
                onCancel={() => setMode('view')}
                onSave={() => setMode('view')}
                qType={qType}
                onChangeQType={handleChangeQType}
                onAnswerSelect={(index) => console.log(index.toString())}
                onChangePoints={(newPoints) => setPoints(newPoints)}
                points={points}
            />
        );
    },
};

export const GradeView: Story = {
    render: () => {
        const [mode, setMode] = useState<Mode>('grade-view');
        const [question, setQuestion] = useState('What is the capital of Germany?');
        const [options, setOptions] = useState<Option[]>([
            { id: '1', text: 'Luxembourg' },
            { id: '2', text: 'Berlin', isCorrect: true },
            { id: '3', text: 'Munich' },
        ]);
        const [isRequired, setIsRequired] = useState(false);
        const [qType, setQType] = useState<QuestionType>('short');
        const [points, setPoints] = useState<number>(10);
        const [selectedAnswerId, setSelectedAnswerId] = useState('1');

        const handleChangeQType = (newType: QuestionType) => {
            setQType(newType);
        };

        const handleAddOption = () => {
            setOptions([...options, { id: Date.now().toString(), text: '' }]);
        };

        const handleRemoveOption = (id: string) => {
            setOptions(options.filter((opt) => opt.id !== id));
        };

        const handleChangeOptionText = (id: string, value: string) => {
            setOptions(options.map((opt) => (opt.id === id ? { ...opt, text: value } : opt)));
        };

        const handleToggleCorrect = (id: string) => {
            setOptions(
                options.map((opt) => (opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt)),
            );
        };

        const handleToggleRequired = (required: boolean) => {
            setIsRequired(required);
        };

        return (
            <MultipleChoiceQ
                mode={mode}
                question={question}
                options={options}
                onChangeQuestion={setQuestion}
                onChangeOptionText={handleChangeOptionText}
                onRemoveOption={handleRemoveOption}
                onAddOption={handleAddOption}
                onToggleCorrect={handleToggleCorrect}
                isRequired={isRequired}
                onToggleRequired={handleToggleRequired}
                onCancel={() => setMode('view')}
                onSave={() => setMode('view')}
                qType={qType}
                onChangeQType={handleChangeQType}
                onAnswerSelect={(index) => setSelectedAnswerId(index.toString())}
                onChangePoints={(newPoints) => setPoints(newPoints)}
                points={points}
                selectedAnswerId={selectedAnswerId}
                feedback={[
                    'Wrong. The correct answer is Berlin',
                    'Make sure to review European capitals before the next exam!',
                ]}
            />
        );
    },
};

export const GradeEdit: Story = {
    render: () => {
        const [mode, setMode] = useState<Mode>('grade-edit');
        const [question, setQuestion] = useState('What is the capital of Germany?');
        const [options, setOptions] = useState<Option[]>([
            { id: '1', text: 'Luxembourg' },
            { id: '2', text: 'Berlin', isCorrect: true },
            { id: '3', text: 'Munich' },
        ]);
        const [isRequired, setIsRequired] = useState(false);
        const [qType, setQType] = useState<QuestionType>('short');
        const [points, setPoints] = useState<number>(10);
        const [selectedAnswerId, setSelectedAnswerId] = useState('2');
        const [feedback, setFeedback] = useState<string[]>(['Correct! The answer is Berlin.']);

        const handleChangeQType = (newType: QuestionType) => {
            setQType(newType);
        };

        const handleAddOption = () => {
            setOptions([...options, { id: Date.now().toString(), text: '' }]);
        };

        const handleRemoveOption = (id: string) => {
            setOptions(options.filter((opt) => opt.id !== id));
        };

        const handleChangeOptionText = (id: string, value: string) => {
            setOptions(options.map((opt) => (opt.id === id ? { ...opt, text: value } : opt)));
        };

        const handleToggleCorrect = (id: string) => {
            setOptions(
                options.map((opt) => (opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt)),
            );
        };

        const handleToggleRequired = (required: boolean) => {
            setIsRequired(required);
        };

        return (
            <MultipleChoiceQ
                mode={mode}
                question={question}
                options={options}
                onChangeQuestion={setQuestion}
                onChangeOptionText={handleChangeOptionText}
                onRemoveOption={handleRemoveOption}
                onAddOption={handleAddOption}
                onToggleCorrect={handleToggleCorrect}
                isRequired={isRequired}
                onToggleRequired={handleToggleRequired}
                onCancel={() => setMode('view')}
                onSave={() => setMode('view')}
                qType={qType}
                onChangeQType={handleChangeQType}
                onAnswerSelect={(index) => setSelectedAnswerId(index.toString())}
                onChangePoints={(newPoints) => setPoints(newPoints)}
                points={points}
                selectedAnswerId={selectedAnswerId}
                feedback={feedback}
                onChangeFeedback={(newFeedback) => setFeedback(newFeedback)}
            />
        );
    },
};

//export default function Test() {}
