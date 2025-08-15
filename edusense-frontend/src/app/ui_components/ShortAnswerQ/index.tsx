import React from 'react';
import './ShortAnswerQ.scss';
import Button from '../Button';
import ToggleSwitch from '../ToggleSwitch';

export type Mode = 'view' | 'edit' | 'answerKey';

export interface CorrectAnswer {
    id: string;
    text: string;
}

interface ShortAnswerQProps {
    mode: Mode;
    question: string;
    answer: string;
    correctAnswers: CorrectAnswer[];
    onChangeCorrectAnswerText: (id: string, value: string) => void;
    onRemoveCorrectAnswer: (id: string) => void;
    onAddCorrectAnswer: () => void;
    onChangeAnswer: (value: string) => void;
    onChangeQuestion: (value: string) => void;
    onToggleRequired?: (required: boolean) => void;
    isRequired?: boolean;
    onAnswerKey: () => void;
    onSave: () => void;
}

const ShortAnswerQ: React.FC<ShortAnswerQProps> = ({
    mode,
    question,
    correctAnswers,
    onChangeCorrectAnswerText,
    onRemoveCorrectAnswer,
    onAddCorrectAnswer,
    answer,
    onChangeAnswer,
    onChangeQuestion,
    onToggleRequired,
    isRequired = false,
    onAnswerKey,
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
                        placeholder="Question*"
                        value={question}
                        onChange={(e) => onChangeQuestion?.(e.target.value)}
                    />
                )}

                {mode !== 'view' && (
                    <Button
                        onClick={onSave}
                        variant="primary"
                        displayName="Save"
                        icon="/save.svg"
                    ></Button>
                )}
            </div>

            {mode === 'answerKey' && (
                <>
                    <p>List All Correct Answer(s):</p>
                    <ul>
                        {correctAnswers.map((ans) => (
                            <li key={ans.id} className="saq-correct-answer">
                                <input
                                    type="text"
                                    value={ans.text}
                                    onChange={(e) =>
                                        onChangeCorrectAnswerText(ans.id, e.target.value)
                                    }
                                    placeholder="Enter correct answer"
                                />
                                <button onClick={() => onRemoveCorrectAnswer?.(ans.id)}>✕</button>
                            </li>
                        ))}
                        <li>
                            <button onClick={onAddCorrectAnswer} className="add-option-btn">
                                <p>+</p>
                                <p>Add Answer</p>
                            </button>
                        </li>
                    </ul>
                </>
            )}

            {mode === 'view' && (
                <label className="saq__answer-label">
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => onChangeAnswer?.(e.target.value)}
                        placeholder="Type your answer here..."
                    />
                </label>
            )}

            {mode === 'edit' && (
                <div className="mcq__footer">
                    <div className="mcq__required-toggle">
                        <ToggleSwitch
                            checked={isRequired}
                            onChange={(checked) => onToggleRequired?.(checked)}
                        />
                        <p>Required</p>
                    </div>
                    <Button
                        onClick={onAnswerKey}
                        displayName="Answer Key"
                        variant="primary"
                    ></Button>
                    <p>Points: ___</p>
                </div>
            )}
        </div>
    );
};

export default ShortAnswerQ;
