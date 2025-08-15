import React from 'react';
import './LongAnswerQ.scss';
import Button from '../Button';
import ToggleSwitch from '../ToggleSwitch';

export type Mode = 'view' | 'edit' | 'answerKey';

interface LongAnswerQProps {
    mode: Mode;
    question: string;
    description?: string;
    onChangeDescription: (value: string) => void;
    onChangeQuestion: (value: string) => void;
    onToggleRequired?: (required: boolean) => void;
    isRequired: boolean;
    onSave: () => void;
}

const LongAnswerQ: React.FC<LongAnswerQProps> = ({
    mode,
    question,
    description,
    onChangeDescription,
    onChangeQuestion,
    onToggleRequired,
    isRequired,
    onSave,
}) => {
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

                {mode !== 'view' && (
                    <Button
                        onClick={onSave}
                        variant="primary"
                        displayName="Save"
                        icon="/save.svg"
                    ></Button>
                )}
            </div>

            {mode === 'view' && (
                <>
                    <div className="laq-description">
                        <p>{description}</p>
                    </div>
                    <div className="upload-btn">
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

            {mode === 'edit' && (
                <div className="mcq__footer">
                    <div className="mcq__required-toggle">
                        <ToggleSwitch
                            checked={isRequired}
                            onChange={(checked) => onToggleRequired?.(checked)}
                        />
                        <p>Required</p>
                    </div>
                    <p>Points: ___</p>
                </div>
            )}
        </div>
    );
};

export default LongAnswerQ;
