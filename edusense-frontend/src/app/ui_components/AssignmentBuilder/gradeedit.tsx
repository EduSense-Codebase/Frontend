import React from 'react';

import { AssignmentBuilderProps, Question } from '.';
import MultipleChoiceQ from '../MultipleChoiceQ';
import ShortAnswerQ from '../ShortAnswerQ';
import LongAnswerQ from '../LongAnswerQ';

interface AssignmentBuilderGradeEditProps extends AssignmentBuilderProps {
    setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const AssignmentBuilderGradeEdit: React.FC<AssignmentBuilderGradeEditProps> = (props) => {
    const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
        props.setQuestions((prev) =>
            prev.map((q) => (q.id === id ? ({ ...q, ...updates } as Question) : q)),
        );
    };

    return (
        <div>
            <nav className="assignment-builder__nav">
                <span className="student-name">Student: {props.studentName}</span>
                <span className="submission-count">
                    <button>{`<`}</button>
                    <u>{props.submissionNumber}</u>
                    <p>of {props.totalSubmissions}</p>
                    <button>{`>`}</button>
                </span>
                <span className="total-points">
                    Total Points: <u>{props.gradedPoints}</u>/{props.totalPoints}
                </span>
            </nav>
            <div className={`quiz-builder quiz-builder--grade-edit`}>
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
                {props.quizQuestions.map((q) => {
                    switch (q.type) {
                        case 'multiple':
                            return (
                                <MultipleChoiceQ
                                    mode="grade-edit"
                                    question={q.question}
                                    points={q.points}
                                    options={q.options}
                                    selectedAnswerId={q.selectedOptionId}
                                    isRequired={q.isRequired}
                                    qType={q.type}
                                    feedback={q.feedback}
                                    onChangeFeedback={(newFeedback) =>
                                        handleUpdateQuestion(q.id, { feedback: newFeedback })
                                    }
                                    isCorrect={q.is_correct}
                                />
                            );
                        case 'short':
                            return (
                                <ShortAnswerQ
                                    mode="grade-edit"
                                    question={q.question}
                                    points={q.points}
                                    studentAnswer={q.answer}
                                    isRequired={q.isRequired}
                                    qType={q.type}
                                    feedback={q.feedback}
                                    onChangeFeedback={(newFeedback) =>
                                        handleUpdateQuestion(q.id, { feedback: newFeedback })
                                    }
                                    isCorrect={q.is_correct}
                                />
                            );
                        case 'long':
                            return (
                                <LongAnswerQ
                                    mode="grade-edit"
                                    question={q.question}
                                    points={q.points}
                                    description={q.description}
                                    file={q.file}
                                    isRequired={q.isRequired}
                                    qType={q.type}
                                    feedback={q.feedback}
                                    onChangeFeedback={(newFeedback) =>
                                        handleUpdateQuestion(q.id, { feedback: newFeedback })
                                    }
                                    isCorrect={q.is_correct}
                                />
                            );
                    }
                })}
            </div>
        </div>
    );
};

export default AssignmentBuilderGradeEdit;
