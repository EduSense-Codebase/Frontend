import React from 'react';
import './MultipleChoiceQ.scss';
import Button from '../Button';
import ToggleSwitch from '../ToggleSwitch';

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
  onRemoveOption: (id: string) => void;
  onAddOption: () => void;
	onToggleCorrect?: (id: string) => void;
  onToggleRequired?: (required: boolean) => void;
	isRequired?: boolean;
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
	onToggleRequired,
	isRequired = false,
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

        {mode !== 'view' && (
					<Button onClick={onSave} variant="primary" displayName="Save" icon="/save.svg"></Button>
        )}
      </div>

			{mode == "answerKey" && (
				<p>Select the Correct Answer(s):</p>
			)}

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
				{mode === 'edit' && (
					<li>
						<button onClick={onAddOption} className="add-option-btn">
							<p>+</p>
							<p>Add Option</p>
						</button>
					</li>
				)}
      </ul>

      {mode === 'edit' && (
        <div className="mcq__footer">
					<div className="mcq__required-toggle">
            <ToggleSwitch
              checked={isRequired}
              onChange={(checked) => onToggleRequired?.(checked)}
            />
            <p>Required</p>
          </div>
					<Button onClick={onAnswerKey} displayName='Answer Key' variant="primary"></Button>
					<p>Points: ___</p>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQ;
