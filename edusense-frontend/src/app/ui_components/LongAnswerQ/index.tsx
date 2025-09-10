import React, { useRef } from 'react';
import './LongAnswerQ.scss';
import Button from '../Button';
import ToggleSwitch from '../ToggleSwitch';
import { QuestionType } from '../AssignmentBuilder';
import Dropdown from '../Dropdown';
import { Mode } from '../MultipleChoiceQ/index';
import Feedback from '../Feedback/index';

interface LongAnswerQProps {
    mode: Mode;
    question: string;
    points?: number;
    description?: string;
    onChangeDescription: (value: string) => void;
    onChangeQuestion: (value: string) => void;
    onToggleRequired?: (required: boolean) => void;
    isRequired: boolean;
    onSave: () => void;
    onChangeQType: (newType: QuestionType) => void;
    onChangePoints: (newPoints: number) => void;
    qType: QuestionType;
    feedback?: string[];
    onChangeFeedback?: (newFeedback: string[]) => void;
    files?: File[];
    onChangeFiles?: (newFiles: File[]) => void;
}

const LongAnswerQ: React.FC<LongAnswerQProps> = ({
    mode,
    question,
    points,
    description,
    onChangeDescription,
    onChangeQuestion,
    onToggleRequired,
    isRequired,
    onSave,
    onChangeQType,
    onChangePoints,
    qType,
    feedback,
    onChangeFeedback,
    files,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
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
    return (
        <div className={`mcq mcq--${mode}`}>
            <div className="mcq__header">
                {mode === 'view' ? (
                    <h3>{question}</h3>
                ) : (
                    <input
                        type="textarea"
                        placeholder="Question*"
                        value={question}
                        onChange={(e) => onChangeQuestion?.(e.target.value)}
                        className="laq-question-input"
                    />
                )}
            </div>

            {mode === 'view' && (
                <>
                    <div className="laq-description">
                        <p>{description}</p>
                    </div>
                    <div className="upload-btn" onClick={() => fileInputRef.current?.click()}>
                        <input type="file" style={{ display: 'none' }} ref={fileInputRef} />
                        <img src="/upload.svg" alt="Upload" />
                        <span>Upload PDF</span>
                    </div>
                </>
            )}

            {mode === 'edit' && (
                <textarea
                    value={description}
                    onChange={(e) => onChangeDescription?.(e.target.value)}
                    placeholder="Write a description here..."
                    className="laq-description-textarea"
                />
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
                    {(mode !== 'edit') && (
                        <div className="uploaded-files">
                            { files && files.length > 0 && (<ul>
                                <h3>Attached Files:</h3>
                                {files.map((file, index) => (
                                    <li key={index}>
                                        {file.name} - {(file.size / 1024).toFixed(2)} KB
                                    </li>
                                ))}
                            </ul>)}
                        </div>
                    )}
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

export default LongAnswerQ;
