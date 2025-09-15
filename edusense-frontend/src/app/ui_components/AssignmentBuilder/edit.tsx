import React from "react";

import { AssignmentBuilderProps, Mode, Question, BaseQuestion, QuestionType, MultipleChoiceQuestion, ShortAnswerQuestion, LongAnswerQuestion } from ".";
import MultipleChoiceQ from "../MultipleChoiceQ";
import ShortAnswerQ from "../ShortAnswerQ";
import LongAnswerQ from "../LongAnswerQ";
import Button from "../Button";

interface AssignmentBuilderEditProps extends AssignmentBuilderProps {
    setQuestions: React.Dispatch<React.SetStateAction<Question[]>>,
    setQuizTitle: React.Dispatch<React.SetStateAction<string>>,
    setQuizDescription: React.Dispatch<React.SetStateAction<string>>,
}

const AssignmentBuilderEdit : React.FC<AssignmentBuilderEditProps> = (props) => {
    const [questionEditIndex, setQuestionEditIndex] = React.useState(-1);

    const currIndex = React.useMemo(() => props.quizQuestions.length, [props.quizQuestions.length])

    const handleDeleteQuestion = (questionId: string) => {
        props.setQuestions((prevQuestions) => {
            return prevQuestions.filter(ele => ele.id !== questionId)
        })
    }

    const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
        props.setQuestions((prev) =>
            prev.map((q) => (q.id === id ? ({ ...q, ...updates } as Question) : q)),
        );
    };

    const handleAddQuestion = (type: QuestionType) => {
        const base: BaseQuestion = {
            id: Date.now().toString(),
            type,
            question: '',
            isRequired: false,
            mode: 'edit',
            order_index: currIndex,
        };

        let newQ: Question;
        if (type === 'multiple') {
            newQ = { ...base, type: 'multiple', options: [] };
        } else if (type === 'short') {
            newQ = { ...base, type: 'short', answer: '', correctAnswers: [] };
        } else {
            newQ = { ...base, type: 'long' };
        }

        setQuestionEditIndex(currIndex);
        props.setQuestions((prev) => [...prev, newQ]);
    };

    const onChangeQType = (questionId: string, newType: QuestionType) => {
        if (newType == "multiple") {
            handleUpdateQuestion(questionId, { type: newType, options: []})
        } else if (newType == "short") {
            handleUpdateQuestion(questionId, { type: newType, answer: "", correctAnswers: []})
        } else if (newType == "long") {
            handleUpdateQuestion(questionId, { type: newType })
        }
    }

    const renderMultipleChoiceQuestion = (q: MultipleChoiceQuestion , questionIndex: number, mode: Mode) => {
        return (
            <MultipleChoiceQ
                mode={mode}
                question={q.question}
                options={q.options}
                points={q.points}
                isRequired={q.isRequired}
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
                onToggleRequired={() =>
                    handleUpdateQuestion(q.id, { isRequired: !q.isRequired })
                }
                onSave={() => setQuestionEditIndex(-1)}
                onChangeQType={(newType) =>
                    onChangeQType(q.id, newType) 
                }
                onChangePoints={(newPoints) =>
                    handleUpdateQuestion(q.id, { points: newPoints })
                }
                qType={q.type}
            />
        )
    }

    const renderShortQuestion = (q: ShortAnswerQuestion, questionIndex: number, mode: Mode) => {
        return (
            <ShortAnswerQ
                mode={mode}
                question={q.question}
                points={q.points}
                isRequired={q.isRequired}
                correctAnswers={q.correctAnswers}
                onChangeQuestion={(val) =>
                    handleUpdateQuestion(q.id, { question: val })
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
                onToggleRequired={() =>
                    handleUpdateQuestion(q.id, { isRequired: !q.isRequired })
                }
                onSave={() => setQuestionEditIndex(-1)}
                onChangeQType={(newType) =>
                    onChangeQType(q.id, newType) 
                }
                onChangePoints={(newPoints) =>
                    handleUpdateQuestion(q.id, { points: newPoints })
                }
                qType={q.type}
            />
        )
    }

    const renderLongQuestion = (q: LongAnswerQuestion, questionIndex: number, mode: Mode) => {
        return (
            <LongAnswerQ
                mode={mode}
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
                onSave={() => setQuestionEditIndex(-1)}
                onChangeQType={(newType) =>
                    onChangeQType(q.id, newType) 
                }
                onChangePoints={(newPoints) =>
                    handleUpdateQuestion(q.id, { points: newPoints })
                }
                qType={q.type}
            />
        )
    }

    const renderQuestion = (q: Question, questionIndex: number) => {
        let mode: Mode = "view";
        if (questionEditIndex == questionIndex) {
            mode = "edit";
        }

        return <div key={q.id}
            className={`question ${mode}-mode`}
            onClick={(e) => {
                if ((e.target as HTMLElement).closest('button'))
                    return;
                setQuestionEditIndex(questionIndex);
            }}>
            
            {mode == 'edit' && (
                <div className="delete-question-btn">
                    <Button
                        displayName=""
                        onClick={() => handleDeleteQuestion(q.id)}
                        variant="icon-secondary"
                        icon="/delete.svg"
                    ></Button>
                </div>
            )}

            {q.type == "multiple" && renderMultipleChoiceQuestion(q, questionIndex, mode)}

            {q.type == "short" && renderShortQuestion(q, questionIndex, mode)}

            {q.type == "long" && renderLongQuestion(q, questionIndex, mode)}
        </div>
    }

    return (
        <div>
            <div className={`quiz-builder quiz-builder--edit`}>
                <input
                    disabled={false}
                    type="text"
                    value={props.title}
                    placeholder="Enter quiz title"
                    onChange={(e) => props.setQuizTitle(e.target.value)}
                    className="quiz-title-input"
                />
                <textarea
                    disabled={false}
                    value={props.description}
                    placeholder="Enter quiz description"
                    onChange={(e) => props.setQuizDescription(e.target.value)}
                    className="quiz-description-input"
                />
                {props.quizQuestions.map((q, questionIndex) => {
                    return renderQuestion(q, questionIndex)
                })}
                <div>
                    <button onClick={() => handleAddQuestion('multiple')} className="add-question-btn">
                        {' '}
                        Add Question{' '}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AssignmentBuilderEdit;