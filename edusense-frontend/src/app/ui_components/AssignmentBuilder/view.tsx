import React from 'react';

import { AssignmentBuilderProps } from '.';
import MultipleChoiceQ from '../MultipleChoiceQ';
import ShortAnswerQ from '../ShortAnswerQ';
import LongAnswerQ from '../LongAnswerQ';

const AssignmentBuilderView: React.FC<AssignmentBuilderProps> = (props) => {
    const onMcAnswerSelection = (questionIndex: number, answerIndex: number) => {
        props.setQuestions((prevQuestions) => {
            return prevQuestions.map((question, currQuestionIndex) => {
                if (question.type == 'multiple' && questionIndex == currQuestionIndex) {
                    return {
                        ...question,
                        selectedOptionId: question.options[answerIndex].id,
                    };
                }
                return question;
            });
        });
        props.onAnswerSelection?.(questionIndex, answerIndex);
    };

    const onSaAnswerSelection = (questionIndex: number, answer: string) => {
        props.setQuestions((prevQuestions) => {
            return prevQuestions.map((question, currQuestionIndex) => {
                if (question.type == 'short' && questionIndex == currQuestionIndex) {
                    return {
                        ...question,
                        answer: answer,
                    };
                }
                return question;
            });
        });
        props.onAnswerSelection?.(questionIndex, answer);
    };

    const onLaAnswerSelection = (questionIndex: number, file?: File) => {
        props.onAnswerSelection?.(questionIndex, file);
    };

    return (
        <div>
            <div className={`quiz-builder quiz-builder--view`}>
                <input
                    disabled={true}
                    type="text"
                    value={props.title}
                    placeholder="Enter quiz title"
                    className="quiz-title-input"
                />
                <textarea
                    disabled={true}
                    value={props.description}
                    placeholder="Enter quiz description"
                    className="quiz-description-input"
                />
                {props.quizQuestions.map((q, questionIndex) => {
                    switch (q.type) {
                        case 'multiple':
                            return (
                                <MultipleChoiceQ
                                    key={`mc-${questionIndex}`}
                                    mode="view"
                                    question={q.question}
                                    points={q.points}
                                    options={q.options}
                                    isRequired={q.isRequired}
                                    selectedAnswerId={q.selectedOptionId}
                                    qType={q.type}
                                    keyPrefix={questionIndex.toString()}
                                    disabled={props.isQuizSubmiited}
                                    onAnswerSelect={(answerIndex) =>
                                        onMcAnswerSelection(questionIndex, answerIndex)
                                    }
                                />
                            );
                        case 'short':
                            return (
                                <ShortAnswerQ
                                    key={`sa-${questionIndex}`}
                                    mode="view"
                                    question={q.question}
                                    points={q.points}
                                    answer={q.answer}
                                    isRequired={q.isRequired}
                                    qType={q.type}
                                    disabled={props.isQuizSubmiited}
                                    onChangeAnswer={(answerValue) =>
                                        onSaAnswerSelection(questionIndex, answerValue)
                                    }
                                />
                            );
                        case 'long':
                            return (
                                <LongAnswerQ
                                    key={`la-${questionIndex}`}
                                    mode="view"
                                    question={q.question}
                                    points={q.points}
                                    description={q.description}
                                    file={q.file}
                                    isRequired={q.isRequired}
                                    qType={q.type}
                                    disabled={props.isQuizSubmiited}
                                    onChangeFile={(answerFile) =>
                                        onLaAnswerSelection(questionIndex, answerFile)
                                    }
                                />
                            );
                    }
                })}
                <div>
                    {props.isQuizSubmiited == undefined || !props.isQuizSubmiited &&
                    <button onClick={props.onSubmit} className="add-question-btn" disabled={props.isQuizSubmitDisabled}>
                        {' '}
                        Submit{' '}
                    </button>}
                </div>
            </div>
        </div>
    );
};

export default AssignmentBuilderView;
