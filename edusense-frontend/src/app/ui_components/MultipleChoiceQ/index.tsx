import React from 'react';
import './MultipleChoiceQ.scss';
import Button from '../Button';
import ToggleSwitch from '../ToggleSwitch';
import { QuestionType } from '../AssignmentBuilder';
import Dropdown from '../Dropdown';

export type Mode = 'view' | 'edit';

export interface Option {
    id: string;
    text: string;
    isCorrect?: boolean;
}

interface MultipleChoiceQProps {
  mode: Mode;
  question: string;
  points? : number,
  options: Option[];
  onChangeQuestion: (value: string) => void;
  onChangeOptionText: (id: string, value: string) => void;
  onRemoveOption: (id: string) => void;
  onAddOption: () => void;
	onToggleCorrect?: (id: string) => void;
  onToggleRequired?: (required: boolean) => void;
	isRequired?: boolean;
  onCancel: () => void;
  onSave: () => void;
  onChangeQType: (newType: QuestionType) => void;
  onChangePoints: (newPoints: number) => void;
  onAnswerSelect: (selectedIndex: number) => void;
  qType: QuestionType;
}

const MultipleChoiceQ: React.FC<MultipleChoiceQProps> = ({
  mode,
  question,
  points,
  options,
  onChangeQuestion,
  onChangeOptionText,
  onRemoveOption,
  onAddOption,
  onToggleCorrect,
	onToggleRequired,
	isRequired = false,
  onSave,
  onChangeQType,
  onChangePoints,
  onAnswerSelect,
  qType
}) => {
  const PointsRender = () => {
    console.log(points);
    if (mode == 'view') {
      return points ? points : "___";
    } else {
      return <input type="number" value={points} onChange={(e) => onChangePoints?.(parseInt(e.target.value))} />
    }
  }

  return (
    <div className={`mcq mcq--${mode}`}>
      <div className="mcq__header">
        {mode === 'view' ? (
          <h3>{question}</h3>
        ) : (
          <input
            type="text"
            placeholder="Question*"
            value={question}
            onChange={(e) => onChangeQuestion?.(e.target.value)}
          />
        )}
      </div>

      <ul className="mcq__options">
        {options.map((opt, index) => (
          <li key={opt.id} className="mcq__option">
            {mode === 'view' && (
              <label className="view-options">
                <input
                  type="radio"
                  name="mcq"
                  onClick={() => onAnswerSelect?.(index)}
                />
                {opt.text}
              </label>
            )}

            {mode === 'edit' && (
              <label className='mcq__option-label'>
								<input
                  type="checkbox"
                  checked={!!opt.isCorrect}
                  onChange={() => onToggleCorrect?.(opt.id)}
                />

                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => onChangeOptionText?.(opt.id, e.target.value)}
                  style={{ flexGrow: 1 }}
                />

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

      {true && (
        <>
        <div className="dropdown">
        {mode === 'edit' ? (
          <>
            <label>Change Question Type:</label>
            <Dropdown 
              value={qType} 
              values={["multiple", "short", "long" ]} 
              options={["Multiple Choice", "Short Answer", "Long Answer"]}
              onChange={(val) => onChangeQType?.(val as QuestionType)}
            />
          </>
        ) : null}
        </div>
        <div className="mcq__footer">
					<div className="mcq__required-toggle">
            {mode === 'edit' ? (
              <>
                <ToggleSwitch
                  checked={isRequired}
                  onChange={(checked) => onToggleRequired?.(checked)}
                />
                <p>Required</p>
              </>) : null}
          </div>
					{mode === 'edit' ? <Button onClick={onSave} variant="primary" displayName="Save" icon="/save.svg"></Button> : null}
					<p>Points: {PointsRender()}</p>
        </div>
        </>
      )}
    </div>
  );
};

export default MultipleChoiceQ;
