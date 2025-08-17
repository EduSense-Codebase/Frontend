import React from 'react';
import './ShortAnswerQ.scss';
import Button from '../Button';
import ToggleSwitch from '../ToggleSwitch';
import { QuestionType } from '../AssignmentBuilder';
import Dropdown from '../Dropdown';

export type Mode = 'view' | 'edit';

export interface CorrectAnswer {
    id: string;
    text: string;
}

interface ShortAnswerQProps {
    mode: Mode;
    question: string;
    points?: number;
    answer: string;
    correctAnswers: CorrectAnswer[];
    onChangeCorrectAnswerText: (id: string, value: string) => void;
    onRemoveCorrectAnswer: (id: string) => void;
    onAddCorrectAnswer: () => void;
    onChangeAnswer: (value: string) => void;
    onChangeQuestion: (value: string) => void;
    onToggleRequired?: (required: boolean) => void;
    isRequired?: boolean;
    onSave: () => void;
    qType: QuestionType;
    onChangeQType?: (type: QuestionType) => void;
    onChangePoints: (newPoints: number) => void;
    onAnswerSelect: (answerValue: string) => void;
}

const ShortAnswerQ: React.FC<ShortAnswerQProps> = ({
    mode,
    question,
    points,
    correctAnswers,
    onChangeCorrectAnswerText,
    onRemoveCorrectAnswer,
    onAddCorrectAnswer,
    answer,
    onChangeAnswer,
    onChangeQuestion,
    onToggleRequired,
    isRequired = false,
    onSave,
    onChangeQType,
    onChangePoints,
    onAnswerSelect,
    qType,
}) => {
    const PointsRender = () => {
        console.log(points);
        if (mode == 'view') {
            return points ? points : '___';
        } else {
            return (
                <input
                    type="number"
                    value={points}
                    onChange={(e) => onChangePoints?.(parseInt(e.target.value))}
                />
            );
        }
    };
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

            {mode === 'edit' && (
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
                        onChange={(e) => {
                            onChangeAnswer?.(e.target.value);
                            onAnswerSelect?.(e.target.value);
                        }}
                        placeholder="Type your answer here..."
                    />
                </label>
            )}

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
                            <Button
                                onClick={onSave}
                                variant="primary"
                                displayName="Save"
                                icon="/save.svg"
                            ></Button>
                        ) : null}
                        <p>Points: {PointsRender()}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default ShortAnswerQ;
