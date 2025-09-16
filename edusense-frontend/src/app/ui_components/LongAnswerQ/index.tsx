import React, { useMemo, useRef, useState } from 'react';
import './LongAnswerQ.scss';
import Button from '../Button';
import ToggleSwitch from '../ToggleSwitch';
import { Mode, QuestionType } from '../AssignmentBuilder';
import Dropdown from '../Dropdown';
import Feedback from '../Feedback/index';
import { IFileInfo } from '@/app/typedef';

interface LongAnswerQProps {
    mode: Mode;
    question: string;
    points?: number;
    totalPoints?: number;
    description?: string;
    onChangeDescription?: (value: string) => void;
    onChangeQuestion?: (value: string) => void;
    onToggleRequired?: (required: boolean) => void;
    isRequired: boolean;
    onSave?: () => void;
    onChangeQType?: (newType: QuestionType) => void;
    onChangePoints?: (newPoints: number) => void;
    qType: QuestionType;
    feedback?: string[];
    isCorrect?: boolean;
    onChangeFeedback?: (newFeedback: string[]) => void;
    file?: IFileInfo;
    onChangeFile?: (newFiles?: File) => void;
}

const View: React.FC<LongAnswerQProps> = (props) => {
    // File Input Reference
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

    const [isStateSync, setIsStateSync] = React.useState(true);

    const onFileChange = (file?: File) => {
        setIsStateSync(false);
        setSelectedFile(file);
        props.onChangeFile?.(file);
    };

    const actualSelectedFile = useMemo(() => {
        if (!isStateSync) {
            return selectedFile;
        }

        if (selectedFile != undefined) {
            return selectedFile;
        }
        if (props.file != undefined) {
            return props.file;
        }
        return undefined;
    }, [selectedFile, props.file, isStateSync]);

    return (
        <div className={`mcq mcq--view`}>
            <div className="mcq__header">
                <h3>{props.question}</h3>
            </div>
            <>
                <div className="laq-description">
                    <p>{props.description}</p>
                </div>
                {!actualSelectedFile && (
                    <div className="upload-btn" onClick={() => fileInputRef.current?.click()}>
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={(e) => onFileChange(e.target.files?.[0])}
                        />
                        <img src="/upload.svg" alt="Upload" />
                        <span>Upload PDF</span>
                    </div>
                )}
            </>
            <div className="dropdown"></div>
            <div className="uploaded-files">
                {actualSelectedFile && (
                    <ul>
                        <h3>Attached Files:</h3>
                        <li className="grid grid-cols-2 gap-0">
                            <div>
                                {actualSelectedFile.name} -{' '}
                                {(actualSelectedFile.size / 1024).toFixed(2)} KB
                            </div>
                            <div>
                                <button onClick={() => onFileChange(undefined)}>X</button>
                            </div>
                        </li>
                    </ul>
                )}
            </div>
            <div className="mcq__footer">
                <div className="mcq__required-toggle"></div>
                <p>Points: {props.points ? props.points : '___'}</p>
            </div>
        </div>
    );
};

const Edit: React.FC<LongAnswerQProps> = (props) => {
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
                <div className="laq-description">
                    <textarea
                        value={props.description}
                        onChange={(e) => props.onChangeDescription?.(e.target.value)}
                        placeholder="Write a description here..."
                        className="laq-description-textarea"
                    />
                </div>
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

const GradeView: React.FC<LongAnswerQProps> = (props) => {
    return (
        <div className={`mcq mcq--view`}>
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
            <>
                <div className="laq-description">
                    <p>{props.description}</p>
                </div>
            </>
            <div className="dropdown"></div>
            <div className="uploaded-files">
                <ul>
                    <h3>Attached Files:</h3>
                    <li className="grid grid-cols-2 gap-0">
                        <div>
                            {props.file?.name} - {(props.file?.size ?? 0 / 1024).toFixed(2)} KB
                        </div>
                    </li>
                </ul>
            </div>
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

const GradeEdit: React.FC<LongAnswerQProps> = (props) => {
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
            <>
                <div className="laq-description">
                    <p>{props.description}</p>
                </div>
            </>
            <div className="dropdown"></div>
            <div className="uploaded-files">
                <ul>
                    <h3>Attached Files:</h3>
                    <li className="grid grid-cols-2 gap-0">
                        <div>
                            {props.file?.name} - {(props.file?.size ?? 0 / 1024).toFixed(2)} KB
                        </div>
                    </li>
                </ul>
            </div>
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

const LongAnswerQ: React.FC<LongAnswerQProps> = (props) => {
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

export default LongAnswerQ;
