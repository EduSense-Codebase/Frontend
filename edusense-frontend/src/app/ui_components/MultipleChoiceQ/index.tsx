import React from 'react';
import './MultipleChoiceQ.scss';
import Button from '../Button';
import ToggleSwitch from '../ToggleSwitch';
import { QuestionType } from '../AssignmentBuilder';
import Dropdown from '../Dropdown';
import { useState } from 'react';
import Feedback from '../Feedback/index';

export type Mode = 'view' | 'edit' | 'grade-view' | 'grade-edit';

export interface Option {
    id: string;
    text: string;
    isCorrect?: boolean;
}

interface MultipleChoiceQProps {
    mode: Mode;
    question: string;
    points?: number;
    options: Option[];
    onChangeQuestion?: (value: string) => void;
    onChangeOptionText?: (id: string, value: string) => void;
    onRemoveOption?: (id: string) => void;
    onAddOption?: () => void;
    onToggleCorrect?: (id: string) => void;
    onToggleRequired?: (required: boolean) => void;
    isRequired?: boolean;
    onCancel?: () => void;
    onSave?: () => void;
    onChangeQType?: (newType: QuestionType) => void;
    onChangePoints: (newPoints: number) => void;
    onAnswerSelect: (selectedIndex: number) => void;
    qType: QuestionType;
    selectedAnswerId?: string;
    feedback?: string[];
    onChangeFeedback?: (newFeedback: string[]) => void;
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
    qType,
    selectedAnswerId,
    feedback,
    onChangeFeedback
}) => {
    const PointsRender = () => {
        console.log(points);
        if (mode === 'view' || mode === 'grade-view') {
            return points ? points : '___';
        } else {
            return (
                <input
                    type="number"
                    value={points}
                    onChange={(e) => onChangePoints?.(parseInt(e.target.value))}
                    className="points-input"
                />
            );
        }
    };

    const correctAnswer = options.find((opt) => opt.isCorrect);
    const [input, setInput] = useState('');

    return (
        <div className={`mcq mcq--${mode}`}>
            <div className="mcq__header">
                {mode !== 'edit' ? (
                    <h3>{question}</h3>
                ) : (
                    <input
                        type="text"
                        placeholder="Question*"
                        value={question}
                        onChange={(e) => onChangeQuestion?.(e.target.value)}
                    />
                )}
                {(mode === 'grade-edit' || mode === 'grade-view') && (
                    selectedAnswerId === undefined ? null : (
                        selectedAnswerId === correctAnswer.id ? (
                        <div className="question-correct">
                            <img src="/grading-page/check.svg" alt="checkmark"/>
                            <p>Correct!</p>
                        </div>
                        ) : (
                        <div className="question-incorrect">
                            <img src="/grading-page/wrong.svg" alt="X" />
                            <p>Incorrect</p>
                        </div>
                        )
                    )
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
                            <label className="mcq__option-label">
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
                        {(mode === 'grade-edit' || mode === 'grade-view') && (
                            <label className="view-options">
                                <input
                                    type="radio"
                                    name="mcq"
                                    checked={selectedAnswerId === opt.id}
                                />
                                {opt.text}
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
                                    values={['multiple', 'short', 'long']}
                                    options={['Multiple Choice', 'Short Answer', 'Long Answer']}
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
                                </>
                            ) : null}
                        </div>
                        {mode === 'edit' ? (
                            <>
                                <Button
                                    onClick={onSave}
                                    variant="primary"
                                    displayName="Save"
                                    icon="/save.svg"
                                ></Button>
                                <p>Points: {PointsRender()}</p>
                            </>
                        ) : <p>Points: {PointsRender()}</p>}
                    </div>
                    <Feedback
                        mode={mode}
                        feedback={feedback || []}
                        onChangeFeedback={onChangeFeedback || (() => {})}
                    />
                </>
            )}
        </div>
    );
};

export default MultipleChoiceQ;
