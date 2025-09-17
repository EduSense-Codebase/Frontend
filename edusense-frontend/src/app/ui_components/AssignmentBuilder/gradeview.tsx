import React from 'react';

import { AssignmentBuilderProps, Question } from '.';
import MultipleChoiceQ from '../MultipleChoiceQ';
import ShortAnswerQ from '../ShortAnswerQ';
import LongAnswerQ from '../LongAnswerQ';

interface AssignmentBuilderGradeViewProps extends AssignmentBuilderProps {
    setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const AssignmentBuilderGradeView: React.FC<AssignmentBuilderGradeViewProps> = (props) => {
    const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
        props.setQuestions((prev) =>
            prev.map((q) => (q.id === id ? ({ ...q, ...updates } as Question) : q)),
        );
    };

    return (
        <div>
            <div className={`quiz-builder quiz-builder--grade-view`}>
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
                                    mode="grade-view"
                                    question={q.question}
                                    points={q.points}
                                    totalPoints={q.totalPoints}
                                    options={q.options}
                                    selectedAnswerId={q.selectedOptionId}
                                    isRequired={q.isRequired}
                                    keyPrefix={questionIndex.toString()}
                                    qType={q.type}
                                    feedback={q.feedback}
                                    onChangeFeedback={(newFeedback) =>
                                        handleUpdateQuestion(q.id, { feedback: newFeedback })
                                    }
                                />
                            );
                        case 'short':
                            return (
                                <ShortAnswerQ
                                    key={`sa-${questionIndex}`}
                                    mode="grade-view"
                                    question={q.question}
                                    points={q.points}
                                    totalPoints={q.totalPoints}
                                    studentAnswer={q.answer}
                                    isRequired={q.isRequired}
                                    qType={q.type}
                                    feedback={q.feedback}
                                    onChangeFeedback={(newFeedback) =>
                                        handleUpdateQuestion(q.id, { feedback: newFeedback })
                                    }
                                />
                            );
                        case 'long':
                            return (
                                <LongAnswerQ
                                    key={`la-${questionIndex}`}
                                    mode="grade-view"
                                    question={q.question}
                                    points={q.points}
                                    totalPoints={q.totalPoints}
                                    description={q.description}
                                    file={q.file}
                                    isRequired={q.isRequired}
                                    qType={q.type}
                                    feedback={q.feedback}
                                    onChangeFeedback={(newFeedback) =>
                                        handleUpdateQuestion(q.id, { feedback: newFeedback })
                                    }
                                />
                            );
                    }
                })}
            </div>
        </div>
    );
};

export default AssignmentBuilderGradeView;
