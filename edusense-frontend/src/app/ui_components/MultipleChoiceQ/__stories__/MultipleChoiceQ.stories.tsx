// stories/MultipleChoiceQ.stories.tsx
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MultipleChoiceQ, { Mode, Option } from '../index';

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
    const [selectedOptionId, setSelectedOptionId] = useState<string>('2');
    const [isRequired, setIsRequired] = useState(false);

    const handleAddOption = () => {
      setOptions([...options, { id: Date.now().toString(), text: '' }]);
    };

    const handleRemoveOption = (id: string) => {
      setOptions(options.filter((opt) => opt.id !== id));
    };

    const handleChangeOptionText = (id: string, value: string) => {
      setOptions(
        options.map((opt) =>
          opt.id === id ? { ...opt, text: value } : opt
        )
      );
    };

    const handleToggleCorrect = (id: string) => {
      setOptions(
        options.map((opt) =>
          opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt
        )
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
        selectedOptionId={selectedOptionId}
        onSelectOption={(id) => setSelectedOptionId(id)}
        onChangeQuestion={setQuestion}
        onChangeOptionText={handleChangeOptionText}
        onRemoveOption={handleRemoveOption}
        onAddOption={handleAddOption}
        onToggleCorrect={handleToggleCorrect}
        isRequired={isRequired}
        onToggleRequired={handleToggleRequired}
        onAnswerKey={() => setMode('answerKey')}
        onCancel={() => setMode('view')}
        onSave={() => setMode('view')}
      />
    );
  },
};
