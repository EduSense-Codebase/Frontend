import React from 'react';
import './MultipleChoiceQ.scss';
import Button from '../Button';

export type Mode = 'view' | 'edit' | 'answerKey';

export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface MultipleChoiceQProps {
  mode: Mode;
  question: string;
  options: Option[];
  selectedOptionId?: string;
  onSelectOption: (id: string) => void;
  onChangeQuestion: (value: string) => void;
  onChangeOptionText: (id: string, value: string) => void;
  onRemoveOption?: (id: string) => void;
  onAddOption: () => void;
  onToggleCorrect?: (id: string) => void;
  onEdit: () => void;
  onAnswerKey: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const MultipleChoiceQ: React.FC<MultipleChoiceQProps> = ({
  mode,
  question,
  options,
  selectedOptionId,
  onSelectOption,
  onChangeQuestion,
  onChangeOptionText,
  onRemoveOption,
  onAddOption,
  onToggleCorrect,
  onEdit,
  onAnswerKey,
  onCancel,
  onSave,
}) => {
  return (
    <div className={`mcq mcq--${mode}`}>
      <div className="mcq__header">
        {mode === 'view' ? (
          <h3>{question}</h3>
        ) : (
          <input
            type="text"
            value={question}
            onChange={(e) => onChangeQuestion?.(e.target.value)}
          />
        )}

        {mode === 'view' && (
          <Button onClick={onEdit} icon="/edit.svg" variant="icon"></Button>
        )}
        {mode !== 'view' && (
          <Button onClick={onCancel} displayName='Cancel' variant="secondary"></Button>
        )}
      </div>

      <ul className="mcq__options">
        {options.map((opt) => (
          <li key={opt.id} className="mcq__option">
            {mode === 'view' && (
              <label>
                <input
                  type="radio"
                  name="mcq"
                  checked={selectedOptionId === opt.id}
                  onChange={() => onSelectOption?.(opt.id)}
                />
                {opt.text}
              </label>
            )}

            {mode === 'edit' && (
              <>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => onChangeOptionText?.(opt.id, e.target.value)}
                />
                <button onClick={() => onRemoveOption?.(opt.id)}>✕</button>
              </>
            )}

            {mode === 'answerKey' && (
              <label className='mcq__option-label'>
								<div className="mcq__option-checkbox">
									<input
										type="checkbox"
										checked={!!opt.isCorrect}
										onChange={() => onToggleCorrect?.(opt.id)}
									/>
									{opt.text}
								</div>
                
                <button onClick={() => onRemoveOption?.(opt.id)}>✕</button>
              </label>
            )}
          </li>
        ))}
      </ul>

      {mode === 'edit' && (
        <div className="mcq__footer">
					<Button onClick={onAddOption} displayName='Add Option' variant="primary" icon="plus.svg"></Button>
					<Button onClick={onAnswerKey} displayName='Answer Key' variant="primary"></Button>
        </div>
      )}

      {mode === 'answerKey' && (
        <div className="mcq__footer">
					<Button onClick={onSave} displayName='Save' variant="primary" icon="/save.svg"></Button>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQ;
