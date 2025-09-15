
import React from 'react';
import { useState } from 'react';
import type { StoryObj, Meta } from '@storybook/nextjs-vite';
import LongAnswerQ from '../index';
import { QuestionType } from '../../AssignmentBuilder';
import { Mode } from '../../MultipleChoiceQ/index';

const meta: Meta<typeof LongAnswerQ> = {
    title: 'Component/LongAnswerQ',
    component: LongAnswerQ,
};

export default meta;

type Story = StoryObj<typeof LongAnswerQ>;

export const Primary: Story = {
    render: () => {
        const [mode, setMode] = useState<Mode>('view');
        const [question, setQuestion] = useState('What is the meaning of life?');
        const [description, setDescription] = useState('Description/Instructions');
        const [isRequired, setIsRequired] = useState(false);
        const [qType, setQType] = useState<QuestionType>('short');
        const [points, setPoints] = useState<number>(10);
        const [files, setFiles] = useState<File[]>([]);

        const handleChangeQType = (newType: QuestionType) => {
            setQType(newType);
        };

        const handleToggleRequired = (required: boolean) => {
            setIsRequired(required);
        };

        return (
            <LongAnswerQ
                mode={mode}
                question={question}
                onChangeQuestion={setQuestion}
                description={description}
                onChangeDescription={setDescription}
                isRequired={isRequired}
                onToggleRequired={handleToggleRequired}
                onSave={() => setMode('view')}
                qType={qType}
                onChangeQType={handleChangeQType}
                onChangePoints={(newPoints) => setPoints(newPoints)}
                points={points}
                file={files}
                onChangeFile={(newFiles) => setFiles(newFiles)}
            />
        );
    },
};

export const Secondary: Story = {
    render: () => {
        const [mode, setMode] = useState<Mode>('edit');
        const [question, setQuestion] = useState('What is the meaning of life?');
        const [description, setDescription] = useState('Description/Instructions');
        const [isRequired, setIsRequired] = useState(false);
        const [qType, setQType] = useState<QuestionType>('short');
        const [points, setPoints] = useState<number>(10);

        const handleChangeQType = (newType: QuestionType) => {
            setQType(newType);
        };

        const handleToggleRequired = (required: boolean) => {
            setIsRequired(required);
        };

        return (
            <LongAnswerQ
                mode={mode}
                question={question}
                onChangeQuestion={setQuestion}
                description={description}
                onChangeDescription={setDescription}
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
        const [mode, setMode] = useState<Mode>('grade-view');
        const [question, setQuestion] = useState('What is the meaning of life?');
        const [description, setDescription] = useState('Description/Instructions');
        const [isRequired, setIsRequired] = useState(false);
        const [qType, setQType] = useState<QuestionType>('short');
        const [points, setPoints] = useState<number>(10);
        const mockFiles:File[] = [
            new File(["Sample file content"], "example.txt", { type: "text/plain" }), 
            new File(["Another file content"], "notes.pdf", { type: "application/pdf" })
        ];

        const handleChangeQType = (newType: QuestionType) => {
            setQType(newType);
        };

        const handleToggleRequired = (required: boolean) => {
            setIsRequired(required);
        };

        return (
            <LongAnswerQ
                mode={mode}
                question={question}
                onChangeQuestion={setQuestion}
                description={description}
                onChangeDescription={setDescription}
                isRequired={isRequired}
                onToggleRequired={handleToggleRequired}
                onSave={() => setMode('view')}
                qType={qType}
                onChangeQType={handleChangeQType}
                onChangePoints={(newPoints) => setPoints(newPoints)}
                points={points}
                feedback={['Good answer', 'Needs more detail']}
                file={mockFiles}
            />
        );
    },
};

export const GradeEdit: Story = {
    render: () => {
        const [mode, setMode] = useState<Mode>('grade-edit');
        const [question, setQuestion] = useState('What is the meaning of life?');
        const [description, setDescription] = useState('Description/Instructions');
        const [isRequired, setIsRequired] = useState(false);
        const [qType, setQType] = useState<QuestionType>('short');
        const [points, setPoints] = useState<number>(10);
        const [feedback, setFeedback] = useState<string[]>(['Good answer', 'Needs more detail']);
        const mockFiles:File[] = [
            new File(["Sample file content"], "example.txt", { type: "text/plain" }), 
            new File(["Another file content"], "notes.pdf", { type: "application/pdf" })
        ];

        const handleChangeQType = (newType: QuestionType) => {
            setQType(newType);
        };

        const handleToggleRequired = (required: boolean) => {
            setIsRequired(required);
        };

        return (
            <LongAnswerQ
                mode={mode}
                question={question}
                onChangeQuestion={setQuestion}
                description={description}
                onChangeDescription={setDescription}
                isRequired={isRequired}
                onToggleRequired={handleToggleRequired}
                onSave={() => setMode('view')}
                qType={qType}
                onChangeQType={handleChangeQType}
                onChangePoints={(newPoints) => setPoints(newPoints)}
                points={points}
                feedback={feedback}
                onChangeFeedback={(newFeedback) => setFeedback(newFeedback)}
                file={mockFiles}
            />
        );
    },
};


//export default function Test() {}
