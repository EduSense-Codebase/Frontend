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
                    <button onClick={() => props.onChangeStudentSubmission?.('back')}>{`<`}</button>
                    <u>{props.submissionNumber}</u>
                    <p>of {props.totalSubmissions}</p>
                    <button
                        onClick={() => props.onChangeStudentSubmission?.('front')}
                    >{`>`}</button>
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
                {props.quizQuestions.map((q, questionIndex) => {
                    switch (q.type) {
                        case 'multiple':
                            return (
                                <MultipleChoiceQ
                                    key={`mc-${questionIndex}`}
                                    mode="grade-edit"
                                    question={q.question}
                                    points={q.points}
                                    totalPoints={q.totalPoints}
                                    options={q.options}
                                    selectedAnswerId={q.selectedOptionId}
                                    isRequired={q.isRequired}
                                    qType={q.type}
                                    keyPrefix={questionIndex.toString()}
                                    feedback={q.feedback}
                                    onChangeFeedback={(newFeedback) =>
                                        handleUpdateQuestion(q.id, { feedback: newFeedback })
                                    }
                                    onChangePoints={(newPoints) =>
                                        handleUpdateQuestion(q.id, { points: newPoints })
                                    }
                                />
                            );
                        case 'short':
                            return (
                                <ShortAnswerQ
                                    key={`sa-${questionIndex}`}
                                    mode="grade-edit"
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
                                    onChangePoints={(newPoints) =>
                                        handleUpdateQuestion(q.id, { points: newPoints })
                                    }
                                />
                            );
                        case 'long':
                            return (
                                <LongAnswerQ
                                    key={`la-${questionIndex}`}
                                    mode="grade-edit"
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
                                    onChangePoints={(newPoints) =>
                                        handleUpdateQuestion(q.id, { points: newPoints })
                                    }
                                />
                            );
                    }
                })}
            </div>
        </div>
    );
};

export default AssignmentBuilderGradeEdit;
