import React, { useEffect } from 'react';
import { useState } from 'react';
import './AssignmentBuilder.scss';
import Button from '../Button';
import MultipleChoiceQ from '../MultipleChoiceQ';
import LongAnswerQ from '../LongAnswerQ';
import ShortAnswerQ from '../ShortAnswerQ';
import {Mode} from '../MultipleChoiceQ/index';

export type QuestionType = 'long' | 'multiple' | 'short';
type QuestionMode = 'view' | 'edit';

interface Option {
    id: string;
    text: string;
    isCorrect?: boolean;
}

interface CorrectAnswer {
    id: string;
    text: string;
}

interface BaseQuestion {
    id: string;
    type: QuestionType;
    points?: number;
    question: string;
    description?: string;
    isRequired: boolean;
    mode: QuestionMode;
    order_index: number;
    feedback?: string[];
    onChangeFeedback?: (newFeedback: string[]) => void;
}

interface LongAnswerQuestion extends BaseQuestion {
    type: 'long';
    files?: File[];
    onChangeFiles?: (newFiles: File[]) => void;
}

interface MultipleChoiceQuestion extends BaseQuestion {
    type: 'multiple';
    options: Option[];
    selectedOptionId?: string;
}

interface ShortAnswerQuestion extends BaseQuestion {
    type: 'short';
    answer: string;
    correctAnswers: CorrectAnswer[];
    studentAnswer?: string;
}

export interface AssignmentBuilderProps {
    quizQuestions: Question[];
    title: string;
    description: string;
    allowEdit: boolean;
    onQuizChange: (newQuizQuestions: Question[]) => void;
    onDescriptionChange: (newDescription: string) => void;
    onTitleChange: (newTitle: string) => void;
    onAnswerSelection: (index: number, value: string | number | File) => void;
    onSubmit: () => void;
    mode: Mode;
    studentName?: string;
    gradedPoints?: number;
    totalPoints?: number;
    submissionNumber?: number;
    totalSubmissions?: number;
}

export type Question = LongAnswerQuestion | MultipleChoiceQuestion | ShortAnswerQuestion;

const AssignmentBuilder: React.FC<AssignmentBuilderProps> = ({
    quizQuestions,
    title,
    description,
    allowEdit,
    onQuizChange,
    onDescriptionChange,
    onTitleChange,
    onAnswerSelection,
    onSubmit,
    mode,
    studentName,
    gradedPoints = 0,
    totalPoints = 0,
    submissionNumber = 0,
    totalSubmissions = 0,
}) => {
    const [questions, setQuestions] = useState<Question[]>(() => {
        return quizQuestions.sort((left, right) => left.order_index - right.order_index);
    });
    const [currIndex, setCurrIndex] = useState(0);
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [quizTitle, setQuizTitle] = useState(title);
    const [quizDescription, setQuizDescription] = useState(description);

    const ToggleAddOptions = () => {
        setShowAddOptions(!showAddOptions);
    };

    const handleAddQuestion = (type: QuestionType) => {
        const base: BaseQuestion = {
            id: Date.now().toString(),
            type,
            question: '',
            isRequired: false,
            mode: 'edit',
            order_index: currIndex
        };

        setCurrIndex(prevCurrIndex => prevCurrIndex + 1);

        let newQ: Question;
        if (type === 'multiple') {
            newQ = { ...base, type: 'multiple', options: [] };
        } else if (type === 'short') {
            newQ = { ...base, type: 'short', answer: '', correctAnswers: [] };
        } else {
            newQ = { ...base, type: 'long' };
        }

        setQuestions((prev) => [...prev, newQ]);
    };

    const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? ({ ...q, ...updates } as Question) : q)),
        );
    };

    const handleChangeQuestionMode = (id: string, mode: QuestionMode) => {
        setQuestions((prev) =>
            prev.map((q) => ({
                ...q,
                mode: q.id === id ? mode : 'view',
            })),
        );
    };

    const handleDeleteQuestion = (id: string) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
    };

    const handleChangeQuestionType = (id: string, newType: QuestionType) => {
        setQuestions((prev) =>
            prev.map((q) => {
                if (q.id !== id) return q;

                const base = {
                    id: q.id,
                    type: newType,
                    question: q.question,
                    description: q.description,
                    isRequired: q.isRequired,
                    mode: q.mode,
                    order_index: q.order_index
                };

                if (newType === 'multiple') {
                    return { ...base, type: 'multiple', options: [] } as MultipleChoiceQuestion;
                } else if (newType === 'short') {
                    return {
                        ...base,
                        type: 'short',
                        answer: '',
                        correctAnswers: [],
                    } as ShortAnswerQuestion;
                } else {
                    return { ...base, type: 'long' } as LongAnswerQuestion;
                }
            }),
        );
    };

    useEffect(() => {
        onQuizChange?.(questions);
    }, [questions]);

    useEffect(() => {
        onTitleChange?.(quizTitle);
    }, [quizTitle]);

    useEffect(() => {
        onDescriptionChange?.(quizDescription);
    }, [quizDescription]);

    return (
        <div>
                {mode === 'grade-edit' && (
                    <nav className="assignment-builder__nav">
                        <span className="student-name">Student: {studentName}</span>
                        <span className="submission-count">
                            <button>{`<`}</button> 
                            <u>{submissionNumber}</u>
                            <p>of {totalSubmissions}</p>
                            <button>{`>`}</button>
                        </span>
                        <span className="total-points">Total Points: <u>{gradedPoints}</u>/{totalPoints}</span>
                    </nav>
                )}
            <div className={`quiz-builder quiz-builder--${mode}`}>
                <input
                    disabled={!allowEdit}
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="Enter quiz title"
                    className="quiz-title-input"
                />
                <textarea
                    disabled={!allowEdit}
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    placeholder="Enter quiz description"
                    className="quiz-description-input"
                />
                {questions.map((q, questionIndex) => {
                    switch (q.type) {
                        case 'long':
                            return (
                                <div
                                    key={q.id}
                                    className={`question ${q.mode}-mode`}
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).closest('button') || !allowEdit)
                                            return;
                                        handleChangeQuestionMode(q.id, 'edit');
                                    }}
                                >
                                    {q.mode == 'edit' && (
                                        <div className="delete-question-btn">
                                            <Button
                                                displayName=""
                                                onClick={() => handleDeleteQuestion(q.id)}
                                                variant="icon-secondary"
                                                icon="/delete.svg"
                                            ></Button>
                                        </div>
                                    )}
                                    {(mode === 'view' || mode === 'edit') ?
                                        (<LongAnswerQ
                                            mode={q.mode}
                                            question={q.question}
                                            points={q.points}
                                            description={q.description}
                                            isRequired={q.isRequired}
                                            onChangeQuestion={(val) =>
                                                handleUpdateQuestion(q.id, { question: val })
                                            }
                                            onChangeDescription={(val) =>
                                                handleUpdateQuestion(q.id, { description: val })
                                            }
                                            onToggleRequired={() =>
                                                handleUpdateQuestion(q.id, { isRequired: !q.isRequired })
                                            }
                                            onSave={() => handleChangeQuestionMode(q.id, 'view')}
                                            onChangeQType={(newType) =>
                                                handleChangeQuestionType(q.id, newType)
                                            }
                                            onChangePoints={(newPoints) =>
                                                handleUpdateQuestion(q.id, { points: newPoints })
                                            }
                                            qType={q.type}
                                        />) :
                                        (<LongAnswerQ
                                            mode={mode}
                                            question={q.question}
                                            points={q.points}
                                            description={q.description}
                                            isRequired={q.isRequired}
                                            onChangePoints={(newPoints) =>
                                                handleUpdateQuestion(q.id, { points: newPoints })
                                            }
                                            qType={q.type}
                                            feedback={q.feedback}
                                            onChangeFeedback={(newFeedback) =>
                                                handleUpdateQuestion(q.id, { feedback: newFeedback })
                                            }
                                            files={q.files}
                                            onChangeFiles={(newFiles) =>
                                                handleUpdateQuestion(q.id, { files: newFiles })
                                            }
                                        />
                                    )}
                                </div>
                            );
                        case 'multiple':
                            return (
                                <div
                                    key={q.id}
                                    className={`question ${q.mode}-mode`}
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).closest('button') || !allowEdit)
                                            return;
                                        handleChangeQuestionMode(q.id, 'edit');
                                    }}
                                >
                                    {q.mode == 'edit' && (
                                        <div className="delete-question-btn">
                                            <Button
                                                onClick={() => handleDeleteQuestion(q.id)}
                                                variant="icon-secondary"
                                                icon="/delete.svg"
                                            ></Button>
                                        </div>
                                    )}
                                    {(mode === 'view' || mode === 'edit') ?
                                    (
                                        <MultipleChoiceQ
                                            mode={q.mode}
                                            question={q.question}
                                            points={q.points}
                                            options={q.options}
                                            onChangeQuestion={(val) =>
                                                handleUpdateQuestion(q.id, { question: val })
                                            }
                                            onChangeOptionText={(optionId, text) =>
                                                handleUpdateQuestion(q.id, {
                                                    options: q.options.map((opt) =>
                                                        opt.id === optionId ? { ...opt, text } : opt,
                                                    ),
                                                })
                                            }
                                            onAddOption={() =>
                                                handleUpdateQuestion(q.id, {
                                                    options: [
                                                        ...q.options,
                                                        { id: Date.now().toString(), text: '' },
                                                    ],
                                                })
                                            }
                                            onRemoveOption={(optionId) =>
                                                handleUpdateQuestion(q.id, {
                                                    options: q.options.filter((opt) => opt.id !== optionId),
                                                })
                                            }
                                            onToggleCorrect={(optionId) =>
                                                handleUpdateQuestion(q.id, {
                                                    options: q.options.map((opt) =>
                                                        opt.id === optionId
                                                            ? { ...opt, isCorrect: !opt.isCorrect }
                                                            : opt,
                                                    ),
                                                })
                                            }
                                            isRequired={q.isRequired}
                                            onToggleRequired={() =>
                                                handleUpdateQuestion(q.id, { isRequired: !q.isRequired })
                                            }
                                            onCancel={() => handleChangeQuestionMode(q.id, 'view')}
                                            onSave={() => handleChangeQuestionMode(q.id, 'view')}
                                            onChangeQType={(newType) =>
                                                handleChangeQuestionType(q.id, newType)
                                            }
                                            onChangePoints={(newPoints) =>
                                                handleUpdateQuestion(q.id, { points: newPoints })
                                            }
                                            onAnswerSelect={(answerIndex) =>
                                                onAnswerSelection?.(questionIndex, answerIndex)
                                            }
                                            qType={q.type}
                                        />
                                    ) : (
                                        <MultipleChoiceQ
                                            mode={mode}
                                            question={q.question}
                                            points={q.points}
                                            options={q.options}
                                            onChangePoints={(newPoints) =>
                                                handleUpdateQuestion(q.id, { points: newPoints })
                                            }
                                            onAnswerSelect={(answerIndex) =>
                                                onAnswerSelection?.(questionIndex, answerIndex)
                                            }
                                            qType={q.type}
                                            selectedAnswerId={q.selectedOptionId}
                                            feedback={q.feedback}
                                            onChangeFeedback={(newFeedback) =>
                                                handleUpdateQuestion(q.id, { feedback: newFeedback })
                                            }
                                        />
                                    )}
                                </div>
                            );
                        case 'short':
                            return (
                                <div
                                    key={q.id}
                                    className={`question ${q.mode}-mode`}
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).closest('button') || !allowEdit)
                                            return;
                                        handleChangeQuestionMode(q.id, 'edit');
                                    }}
                                >
                                    {q.mode == 'edit' && (
                                        <div className="delete-question-btn">
                                            <Button
                                                onClick={() => handleDeleteQuestion(q.id)}
                                                variant="icon-secondary"
                                                icon="/delete.svg"
                                            ></Button>
                                        </div>
                                    )}
                                    {(mode === 'view' || mode === 'edit') ? (
                                        <ShortAnswerQ
                                            mode={q.mode}
                                            question={q.question}
                                            points={q.points}
                                            answer={q.answer}
                                            correctAnswers={q.correctAnswers}
                                            onChangeAnswer={(val) =>
                                                handleUpdateQuestion(q.id, { answer: val })
                                            }
                                            onChangeCorrectAnswerText={(answerId, val) =>
                                                handleUpdateQuestion(q.id, {
                                                    correctAnswers: q.correctAnswers.map((ans) =>
                                                        ans.id === answerId ? { ...ans, text: val } : ans,
                                                    ),
                                                })
                                            }
                                            onAddCorrectAnswer={() =>
                                                handleUpdateQuestion(q.id, {
                                                    correctAnswers: [
                                                        ...q.correctAnswers,
                                                        { id: Date.now().toString(), text: '' },
                                                    ],
                                                })
                                            }
                                            onRemoveCorrectAnswer={(answerId) =>
                                                handleUpdateQuestion(q.id, {
                                                    correctAnswers: q.correctAnswers.filter(
                                                        (ans) => ans.id !== answerId,
                                                    ),
                                                })
                                            }
                                            onChangeQuestion={(val) =>
                                                handleUpdateQuestion(q.id, { question: val })
                                            }
                                            isRequired={q.isRequired}
                                            onToggleRequired={() =>
                                                handleUpdateQuestion(q.id, { isRequired: !q.isRequired })
                                            }
                                            onSave={() => handleChangeQuestionMode(q.id, 'view')}
                                            onChangeQType={(newType) =>
                                                handleChangeQuestionType(q.id, newType)
                                            }
                                            onChangePoints={(newPoints) =>
                                                handleUpdateQuestion(q.id, { points: newPoints })
                                            }
                                            qType={q.type}
                                        />) : (
                                        <ShortAnswerQ
                                            mode={mode}
                                            question={q.question}
                                            points={q.points}
                                            correctAnswers={q.correctAnswers}
                                            isRequired={q.isRequired}
                                            onChangePoints={(newPoints) =>
                                                handleUpdateQuestion(q.id, { points: newPoints })
                                            }
                                            qType={q.type}
                                            studentAnswer={q.studentAnswer}
                                            feedback={q.feedback}
                                            onChangeFeedback={(newFeedback) =>
                                                handleUpdateQuestion(q.id, { feedback: newFeedback })
                                            }
                                        />
                                    )}
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
                <div>
                    {allowEdit ? (
                        <button onClick={ToggleAddOptions} className="add-question-btn">
                            {' '}
                            Add Question{' '}
                        </button>
                    ) : (
                        <button onClick={onSubmit} className="add-question-btn">
                            {' '}
                            Submit{' '}
                        </button>
                    )}
                </div>
                {showAddOptions && (
                    <div className="add-question-options">
                        <Button
                            onClick={() => handleAddQuestion('multiple')}
                            displayName="Multiple Choice"
                            variant="primary"
                        ></Button>
                        <Button
                            onClick={() => handleAddQuestion('long')}
                            displayName="Long Answer"
                            variant="primary"
                        ></Button>
                        <Button
                            onClick={() => handleAddQuestion('short')}
                            displayName="Short Answer"
                            variant="primary"
                        ></Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentBuilder;
