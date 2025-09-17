import React from 'react';
import './ShortAnswerQ.scss';
import Button from '../Button';
import ToggleSwitch from '../ToggleSwitch';
import { Mode, QuestionType } from '../AssignmentBuilder';
import Dropdown from '../Dropdown';
import Feedback from '../Feedback/index';

export interface CorrectAnswer {
    id: string;
    text: string;
}

interface ShortAnswerQProps {
    mode: Mode;
    question: string;
    qType: QuestionType;
    points?: number;
    totalPoints?: number;
    answer?: string;
    correctAnswers?: CorrectAnswer[];
    isRequired?: boolean;
    studentAnswer?: string;
    feedback?: string[];
    disabled?: boolean;
    onChangeCorrectAnswerText?: (id: string, value: string) => void;
    onRemoveCorrectAnswer?: (id: string) => void;
    onAddCorrectAnswer?: () => void;
    onChangeAnswer?: (value: string) => void;
    onChangeQuestion?: (value: string) => void;
    onToggleRequired?: (required: boolean) => void;
    onSave?: () => void;
    onChangeQType?: (type: QuestionType) => void;
    onChangePoints?: (newPoints: number) => void;
    onChangeFeedback?: (newFeedback: string[]) => void;
}

const View: React.FC<ShortAnswerQProps> = (props) => {
    const onTextAreaChange = (newValue: string) => {
        props.onChangeAnswer?.(newValue);
    };

    return (
        <div className={`mcq mcq--view`}>
            <div className="mcq__header">
                <h3>{props.question}</h3>
            </div>
            <label className="saq__answer-label">
                <input
                    type="text"
                    value={props.answer ?? ''}
                    onChange={(e) => onTextAreaChange(e.target.value)}
                    placeholder="Type your answer here..."
                    disabled={props.disabled}
                />
            </label>
            <div className="dropdown"></div>
            <div className="mcq__footer">
                <div className="mcq__required-toggle"></div>
                <p>Points: {props.points ? props.points : '___'}</p>
            </div>
        </div>
    );
};

const Edit: React.FC<ShortAnswerQProps> = (props) => {
    return (
        <div className={`mcq mcq--view`}>
            <div className="mcq__header">
                <input
                    type="text"
                    placeholder="Question*"
                    value={props.question}
                    onChange={(e) => props.onChangeQuestion?.(e.target.value)}
                />
            </div>
            <>
                <p>List All Correct Answer(s):</p>
                <ul>
                    {props.correctAnswers?.map((ans: CorrectAnswer) => (
                        <li key={ans.id} className="saq-correct-answer">
                            <input
                                type="text"
                                value={ans.text}
                                onChange={(e) =>
                                    props.onChangeCorrectAnswerText?.(ans.id, e.target.value)
                                }
                                placeholder="Enter correct answer"
                            />
                            <button onClick={() => props.onRemoveCorrectAnswer?.(ans.id)}>✕</button>
                        </li>
                    ))}
                    <li>
                        <button onClick={props.onAddCorrectAnswer} className="add-option-btn">
                            <p>+</p>
                            <p>Add Answer</p>
                        </button>
                    </li>
                </ul>
            </>
            <div className="dropdown">
                <>
                    <label>Change Question Type:</label>
                    <Dropdown
                        value={props.qType}
                        values={['multiple', 'short', 'long']}
                        options={['Multiple Choice', 'Short Answer', 'Long Answer']}
                        onChange={(val) => props.onChangeQType?.(val as QuestionType)}
                    />
                </>
            </div>
            <div className="mcq__footer">
                <div className="mcq__required-toggle">
                    <div className="mcq__required-toggle">
                        <ToggleSwitch
                            checked={Boolean(props.isRequired)}
                            onChange={(checked) => props.onToggleRequired?.(checked)}
                        />
                        <p>Required</p>
                    </div>
                </div>
                <>
                    <Button
                        onClick={props.onSave}
                        variant="primary"
                        displayName="Save"
                        icon="/save.svg"
                    ></Button>
                    <p>
                        Points:{' '}
                        <input
                            type="number"
                            value={props.points}
                            onChange={(e) => props.onChangePoints?.(parseInt(e.target.value))}
                            className="points-input"
                        />
                    </p>
                </>
            </div>
        </div>
    );
};

const GradeView: React.FC<ShortAnswerQProps> = (props) => {
    return (
        <div className={`mcq mcq--view`}>
            <div className="mcq__header">
                <h3>{props.question}</h3>
                {props.points == props.totalPoints ? (
                    <div className="question-correct">
                        <img src="/grading-page/check.svg" alt="checkmark" />
                        <p>Correct!</p>
                    </div>
                ) : (
                    <div className="question-incorrect">
                        <img src="/grading-page/wrong.svg" alt="X" />
                        <p>Incorrect</p>
                    </div>
                )}
            </div>
            <label className="saq__answer-label">
                <input
                    type="text"
                    value={props.studentAnswer ?? ''}
                    placeholder="Type your answer here..."
                    readOnly
                />
            </label>
            <div className="dropdown"></div>
            <div className="mcq__footer">
                <div className="mcq__required-toggle"></div>
                <p>
                    Points: {props.points != undefined ? props.points : '___'} / {props.totalPoints}
                </p>
            </div>
            <Feedback mode="grade-view" feedback={props.feedback || []} />
        </div>
    );
};

const GradeEdit: React.FC<ShortAnswerQProps> = (props) => {
    return (
        <div className={`mcq mcq--grade-edit`}>
            <div className="mcq__header">
                <h3>{props.question}</h3>
                {props.points == props.totalPoints ? (
                    <div className="question-correct">
                        <img src="/grading-page/check.svg" alt="checkmark" />
                        <p>Correct!</p>
                    </div>
                ) : (
                    <div className="question-incorrect">
                        <img src="/grading-page/wrong.svg" alt="X" />
                        <p>Incorrect</p>
                    </div>
                )}
            </div>
            <label className="saq__answer-label">
                <input
                    type="text"
                    value={props.studentAnswer ?? ''}
                    placeholder="Type your answer here..."
                    readOnly
                />
            </label>
            <div className="dropdown"></div>
            <div className="mcq__footer">
                <div className="mcq__required-toggle"></div>
                <p>
                    Points:{' '}
                    <input
                        type="number"
                        value={props.points}
                        onChange={(e) => props.onChangePoints?.(parseInt(e.target.value))}
                        className="points-input"
                    />{' '}
                    / {props.totalPoints}
                </p>
            </div>
            <Feedback
                mode="grade-edit"
                feedback={props.feedback || []}
                onChangeFeedback={props.onChangeFeedback}
            />
        </div>
    );
};

const ShortAnswerQ: React.FC<ShortAnswerQProps> = (props) => {
    if (props.mode == 'view') {
        return <View {...props} />;
    }

    if (props.mode == 'edit') {
        return <Edit {...props} />;
    }

    if (props.mode == 'grade-view') {
        return <GradeView {...props} />;
    }

    if (props.mode == 'grade-edit') {
        return <GradeEdit {...props} />;
    }
};

export default ShortAnswerQ;
