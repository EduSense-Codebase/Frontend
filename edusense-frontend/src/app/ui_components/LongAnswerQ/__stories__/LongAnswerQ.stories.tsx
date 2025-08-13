import React from 'react';
import { useState } from 'react';
import type { StoryObj, Meta } from '@storybook/nextjs-vite';
import LongAnswerQ, { Mode } from '../index';

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
      />
    );
  },
};
