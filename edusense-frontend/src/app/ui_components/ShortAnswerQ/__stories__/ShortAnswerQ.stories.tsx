import React from 'react';
import { useState } from 'react';
import type { StoryObj, Meta } from '@storybook/nextjs-vite';
import ShortAnswerQ, { Mode, CorrectAnswer } from '../index';
import { QuestionType } from '../../AssignmentBuilder';

const meta: Meta<typeof ShortAnswerQ> = {
  title: 'Component/ShortAnswerQ',
  component: ShortAnswerQ,
};

export default meta;

type Story = StoryObj<typeof ShortAnswerQ>;

export const Primary: Story = {
  render: () => {
    const [correctAnswers, setCorrectAnswers] = useState<CorrectAnswer[]>([]);
    const [mode, setMode] = useState<Mode>('view');
    const [question, setQuestion] = useState('What is the capital of Germany?');
    const [answer, setAnswer] = useState('');
    const [isRequired, setIsRequired] = useState(false);
    const [qType, setQType] = useState<QuestionType>("Short Answer")

    const handleChangeQType = (newType: QuestionType) => {
        setQType(newType);
    }

    const handleAddAnswer = () => {
      setCorrectAnswers([...correctAnswers, { id: Date.now().toString(), text: '' }]);
    };

    const handleRemoveAnswer = (id: string) => {
      setCorrectAnswers(correctAnswers.filter((ans) => ans.id !== id));
    };

    const handleChangeAnswerText = (id: string, value: string) => {
      setCorrectAnswers(
        correctAnswers.map((ans) =>
          ans.id === id ? { ...ans, text: value } : ans
        )
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
      />
    );
  },
};

export const Secondary: Story = {
  render: () => {
    const [correctAnswers, setCorrectAnswers] = useState<CorrectAnswer[]>([]);
    const [mode, setMode] = useState<Mode>('edit');
    const [question, setQuestion] = useState('What is the capital of Germany?');
    const [answer, setAnswer] = useState('');
    const [isRequired, setIsRequired] = useState(false);
    const [qType, setQType] = useState<QuestionType>("Short Answer")

    const handleChangeQType = (newType: QuestionType) => {
        setQType(newType);
    }

    const handleAddAnswer = () => {
      setCorrectAnswers([...correctAnswers, { id: Date.now().toString(), text: '' }]);
    };

    const handleRemoveAnswer = (id: string) => {
      setCorrectAnswers(correctAnswers.filter((ans) => ans.id !== id));
    };

    const handleChangeAnswerText = (id: string, value: string) => {
      setCorrectAnswers(
        correctAnswers.map((ans) =>
          ans.id === id ? { ...ans, text: value } : ans
        )
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
      />
    );
  },
};
