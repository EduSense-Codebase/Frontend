import React from 'react';

import { AssignmentBuilderProps } from '.';
import MultipleChoiceQ from '../MultipleChoiceQ';
import ShortAnswerQ from '../ShortAnswerQ';
import LongAnswerQ from '../LongAnswerQ';

const AssignmentBuilderView: React.FC<AssignmentBuilderProps> = (props) => {
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
                                    mode="view"
                                    question={q.question}
                                    points={q.points}
                                    options={q.options}
                                    isRequired={q.isRequired}
                                    selectedAnswerId={q.selectedOptionId}
                                    qType={q.type}
                                    onAnswerSelect={(answerIndex) =>
                                        props.onAnswerSelection?.(questionIndex, answerIndex)
                                    }
                                />
                            );
                        case 'short':
                            return (
                                <ShortAnswerQ
                                    mode="view"
                                    question={q.question}
                                    points={q.points}
                                    answer={q.answer}
                                    isRequired={q.isRequired}
                                    qType={q.type}
                                    onChangeAnswer={(answerValue) =>
                                        props.onAnswerSelection?.(questionIndex, answerValue)
                                    }
                                />
                            );
                        case 'long':
                            return (
                                <LongAnswerQ
                                    mode="view"
                                    question={q.question}
                                    points={q.points}
                                    description={q.description}
                                    isRequired={q.isRequired}
                                    qType={q.type}
                                    onChangeFile={(answerFile) =>
                                        props.onAnswerSelection?.(questionIndex, answerFile)
                                    }
                                />
                            );
                    }
                })}
                <div>
                    <button onClick={props.onSubmit} className="add-question-btn">
                        {' '}
                        Submit{' '}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignmentBuilderView;
