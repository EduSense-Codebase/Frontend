import React, { useEffect } from 'react';
import './MultipleChoiceQ.scss';
import Button from '../Button';
import ToggleSwitch from '../ToggleSwitch';
import { Mode, QuestionType } from '../AssignmentBuilder';
import Dropdown from '../Dropdown';
import { useState } from 'react';
import Feedback from '../Feedback/index';

export interface Option {
    id: string;
    text: string;
    isCorrect?: boolean;
}

interface MultipleChoiceQProps {
    mode: Mode;
    question: string;
    options: Option[];
    qType: QuestionType;
    isRequired?: boolean;
    points?: number;
    totalPoints?: number;
    selectedAnswerId?: string;
    feedback?: string[];
    isCorrect?: boolean;
    onChangeQuestion?: (value: string) => void;
    onChangeOptionText?: (id: string, value: string) => void;
    onRemoveOption?: (id: string) => void;
    onAddOption?: () => void;
    onToggleCorrect?: (id: string) => void;
    onToggleRequired?: (required: boolean) => void;
    onCancel?: () => void;
    onSave?: () => void;
    onChangeQType?: (newType: QuestionType) => void;
    onChangePoints?: (newPoints: number) => void;
    onAnswerSelect?: (selectedIndex: number) => void;
    onChangeFeedback?: (newFeedback: string[]) => void;
}

const View: React.FC<MultipleChoiceQProps> = (props) => {
    // State Variables to Control Form
    const [selectedIndex, setSelectedIndex] = useState(-1);

    useEffect(() => {
        setSelectedIndex(() => {
            if (props.selectedAnswerId != undefined) {
                return props.options.findIndex((option) => option.id == props.selectedAnswerId);
            }
            return -1;
        });
    }, [props.selectedAnswerId]);

    const onRadioSelect = (newSelectedIndex: number) => {
        setSelectedIndex(newSelectedIndex);
        props.onAnswerSelect?.(newSelectedIndex);
    };

    return (
        <div className={`mcq mcq--view`}>
            <div className="mcq__header">
                <h3>{props.question}</h3>
            </div>
            <ul className="mcq__options">
                {props.options.map((option, index) => (
                    <li key={option.id} className="mcq__option">
                        <label className="view-options">
                            <input
                                type="radio"
                                name="mcq"
                                checked={index == selectedIndex}
                                onClick={() => onRadioSelect(index)}
                            />
                            {option.text}
                        </label>
                    </li>
                ))}
            </ul>
            <div className="dropdown"></div>
            <div className="mcq__footer">
                <div className="mcq__required-toggle"></div>
                <p>Points: {props.points ? props.points : '___'}</p>
            </div>
        </div>
    );
};

const Edit: React.FC<MultipleChoiceQProps> = (props) => {
    return (
        <div className={`mcq mcq--edit`}>
            <div className="mcq__header">
                <input
                    type="text"
                    placeholder="Question*"
                    value={props.question}
                    onChange={(e) => props.onChangeQuestion?.(e.target.value)}
                />
            </div>
            <ul className="mcq__options">
                {props.options.map((option) => (
                    <li key={option.id} className="mcq__option">
                        <label className="mcq__option-label">
                            <input
                                type="checkbox"
                                checked={option.isCorrect}
                                onChange={() => props.onToggleCorrect?.(option.id)}
                            />

                            <input
                                type="text"
                                value={option.text}
                                onChange={(e) =>
                                    props.onChangeOptionText?.(option.id, e.target.value)
                                }
                                style={{ flexGrow: 1 }}
                            />

                            <button onClick={() => props.onRemoveOption?.(option.id)}>✕</button>
                        </label>
                    </li>
                ))}
                <li>
                    <button onClick={props.onAddOption} className="add-option-btn">
                        <p>+</p>
                        <p>Add Option</p>
                    </button>
                </li>
            </ul>
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
                    <>
                        <ToggleSwitch
                            checked={Boolean(props.isRequired)}
                            onChange={(checked) => props.onToggleRequired?.(checked)}
                        />
                        <p>Required</p>
                    </>
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

const GradeView: React.FC<MultipleChoiceQProps> = (props) => {
    return (
        <div className={`mcq mcq--grade-view`}>
            <div className="mcq__header">
                <h3>{props.question}</h3>
                {props.isCorrect ? (
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
            <ul className="mcq__options">
                {props.options.map((option) => (
                    <li key={option.id} className="mcq__option">
                        <label className="view-options">
                            <input
                                type="radio"
                                name="mcq"
                                checked={props.selectedAnswerId == option.id}
                            />
                            {option.text}
                        </label>
                    </li>
                ))}
            </ul>
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

const GradeEdit: React.FC<MultipleChoiceQProps> = (props) => {
    return (
        <div className={`mcq mcq--grade-edit`}>
            <div className="mcq__header">
                <h3>{props.question}</h3>
                {props.isCorrect ? (
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
            <ul className="mcq__options">
                {props.options.map((option) => (
                    <li key={option.id} className="mcq__option">
                        <label className="view-options">
                            <input
                                type="radio"
                                name="mcq"
                                checked={props.selectedAnswerId == option.id}
                            />
                            {option.text}
                        </label>
                    </li>
                ))}
            </ul>
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

const MultipleChoiceQ: React.FC<MultipleChoiceQProps> = (props) => {
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

export default MultipleChoiceQ;
