'use client';

export const runtime = 'edge';

import './builder.scss';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Text from '../../../../ui_components/Text';
import { useEffect, useState } from 'react';
import { httpGet, httpPost } from '@/app/utils';
import { API_PREFIX, COURSE_ENDPOINT } from '@/app/global';
import {
    IBuilderResponse,
    IFileInfo,
    IModules,
    IModulesResponse,
    ISubmitFileResponse,
} from '@/app/typedef';
import AssignmentBuilder, {
    LongAnswerQuestion,
    Mode,
    MultipleChoiceQuestion,
    Question,
    ShortAnswerQuestion,
} from '@/app/ui_components/AssignmentBuilder';
import { useCustomProp } from '@/app/typedef';
import Button from '@/app/ui_components/Button';
import toast from 'react-hot-toast';

export interface IQuizSubmission {
    type: 'multiple' | 'short' | 'long';
    multiple_value?: number;
    short_value?: string;
    long_value?: IFileInfo;
}

export interface IQuizFeedback {
    type: 'multiple' | 'short' | 'long';
    score: number;
    feedback: string[];
}

export interface IQuizPerStudentInformation {
    answers: IQuizSubmission[];
    ai_grade?: IQuizFeedback[] | number;
}

export interface IBaseQuestionConfiguration {
    question: string;
    points: number;
    order_index: number;
}

export interface IMultipleChoiceConfiguration extends IBaseQuestionConfiguration {
    answers: string[]; // Answer Choices
    correct_index: number; // Index of Answer Choices which is correct
}

export interface IShortAnswerConfiguration extends IBaseQuestionConfiguration {
    answers: string[]; // List of answer choices which are considered correct
}

export interface ILongAnswerConfiguration extends IBaseQuestionConfiguration {
    description: string;
}

export interface ISubmittedStudents {
    id: number;
    name: string;
}

export interface IQuizConfiguration {
    title: string;
    description: string;
    multiple_choice_questions: IMultipleChoiceConfiguration[];
    short_answer_questions: IShortAnswerConfiguration[];
    long_answer_questions: ILongAnswerConfiguration[];
}

const transformQuizQuestions = (quizConfiguration: IQuizConfiguration): Question[] => {
    const quizQuestions: Question[] = [];

    // Assemble into Question Array

    quizConfiguration.multiple_choice_questions.forEach((mcConfig, index) => {
        const assembledQuestion: MultipleChoiceQuestion = {
            id: `mc-${index}`,
            type: 'multiple',
            question: mcConfig.question,
            isRequired: true,
            orderIndex: mcConfig.order_index,
            points: mcConfig.points,
            totalPoints: mcConfig.points,
            options: mcConfig.answers.map((currAnswer, answerIndex) => {
                return {
                    id: `mc-${index}-${answerIndex}`,
                    text: currAnswer,
                    isCorrect: answerIndex == mcConfig.correct_index,
                };
            }),
        };
        quizQuestions.push(assembledQuestion);
    });

    quizConfiguration.short_answer_questions.forEach((shortConfig, index) => {
        const assembledQuestion: ShortAnswerQuestion = {
            id: `sa-${index}`,
            type: 'short',
            question: shortConfig.question,
            isRequired: true,
            orderIndex: shortConfig.order_index,
            points: shortConfig.points,
            totalPoints: shortConfig.points,
            correctAnswers: shortConfig.answers.map((currAnswer, answerIndex) => {
                return {
                    id: `sa-${index}-${answerIndex}`,
                    text: currAnswer,
                };
            }),
        };
        quizQuestions.push(assembledQuestion);
    });

    quizConfiguration.long_answer_questions.forEach((longConfig, index) => {
        const assembledQuestion: LongAnswerQuestion = {
            id: `la-${index}`,
            type: 'long',
            question: longConfig.question,
            isRequired: true,
            orderIndex: longConfig.order_index,
            points: longConfig.points,
            totalPoints: longConfig.points,
            description: longConfig.description,
        };
        quizQuestions.push(assembledQuestion);
    });

    return quizQuestions.sort((left, right) => left.orderIndex - right.orderIndex);
};

const reverseTransformQuizQuestions = (questions: Question[]): Partial<IQuizConfiguration> => {
    const extractedQuestions: Partial<IQuizConfiguration> = {
        multiple_choice_questions: [],
        short_answer_questions: [],
        long_answer_questions: [],
    };

    questions.forEach((question) => {
        if (question.type == 'multiple') {
            const extractedQuestion: IMultipleChoiceConfiguration = {
                question: question.question,
                points: question.points ?? 0,
                order_index: question.orderIndex,
                answers: question.options.map((option) => option.text),
                correct_index: question.options.findIndex((option) => option.isCorrect),
            };
            extractedQuestions.multiple_choice_questions?.push(extractedQuestion);
        } else if (question.type == 'short') {
            const extractedQuestion: IShortAnswerConfiguration = {
                question: question.question,
                points: question.points ?? 0,
                order_index: question.orderIndex,
                answers: question.correctAnswers.map((answer) => answer.text),
            };
            extractedQuestions.short_answer_questions?.push(extractedQuestion);
        } else if (question.type == 'long') {
            const extractedQuestion: ILongAnswerConfiguration = {
                question: question.question,
                points: question.points ?? 0,
                order_index: question.orderIndex,
                description: question.description ?? '',
            };
            extractedQuestions.long_answer_questions?.push(extractedQuestion);
        }
    });

    return extractedQuestions;
};

export default function BuilderPage() {
    const params = useParams();
    const courseId = params.courseId as string;
    const builderId = params.builderId as string;

    const searchParams = useSearchParams();
    const passedMode = searchParams.get('mode') as string | undefined;
    const passedUserId = searchParams.get('userId') as string | undefined;

    const router = useRouter();

    const { permissions, setCurrCourseId, setCurrBuilderId } = useCustomProp();

    const [mode, setMode] = useState<Mode | undefined>(undefined);

    /* Fetched Text Content */
    const [textContent, setTextContent] = useState<string | undefined>(undefined);

    /* Change Text Content Tracker */
    const [updatedTextContent, setUpdatedTextContent] = useState<string | undefined>(undefined);

    /* Fetched Quiz Content */
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

    /* Module Level Information for Assignment Creation */
    const [modules, setModules] = useState<IModules[]>([]);

    /* Publish Assignment State Variables */
    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [moduleId, setModuleId] = useState(-1);
    const [assignmentDescription, setAssignmentDescription] = useState('');
    const [isDraft, setIsDraft] = useState(false);

    /* Assignment Level Information */
    const [isAssignmentCreated, setIsAssignmentCreated] = useState(false);
    const [showAssignmentCreateModal, setShowAssignmentCreateModal] = useState(false);

    /* Quiz Submission Information */
    const [quizSubmission, setQuizSubmission] = useState<IQuizSubmission[]>([]);

    /* Grade Edit Student Submission Information */
    const [allStudentQuizSubmission, setAllStudentQuizSubmission] = useState<
        Record<number, IQuizPerStudentInformation>
    >({});
    const [allSubmittedStudents, setAllSubmittedStudents] = useState<ISubmittedStudents[]>([]);
    const [currentDisplayStudentSubmission, setCurrentDisplayStudentSubmission] = useState(-1);
    const [currentStudentPoints, setCurrentStudentPoints] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);

    const url = `${API_PREFIX}${COURSE_ENDPOINT}`;

    const setSubmissionDataOnQuizContent = (submissionData: IQuizSubmission[]) => {
        let mcIndex = -1;
        let saIndex = -1;
        let laIndex = -1;
        const mcAnswers = submissionData.filter((ele) => ele.type == 'multiple');
        const saAnswers = submissionData.filter((ele) => ele.type == 'short');
        const laAnswers = submissionData.filter((ele) => ele.type == 'long');
        setQuizQuestions((prevQuizQuestions) => {
            return prevQuizQuestions.map((question) => {
                if (question.type == 'multiple') {
                    if (mcAnswers[mcIndex + 1] != undefined) {
                        mcIndex += 1;
                        return {
                            ...question,
                            selectedOptionId:
                                question.options[mcAnswers[mcIndex].multiple_value ?? 0].id,
                        };
                    }
                } else if (question.type == 'short') {
                    saIndex += 1;
                    if (saAnswers[saIndex + 1] != undefined) {
                        saIndex += 1;
                        return {
                            ...question,
                            answer: saAnswers[saIndex].short_value,
                        };
                    }
                } else if (question.type == 'long') {
                    if (laAnswers[laIndex + 1] != undefined) {
                        laIndex += 1;
                        return {
                            ...question,
                            file: laAnswers[laIndex].long_value,
                        };
                    }
                }
                return {
                    ...question,
                };
            });
        });
    };

    const setFeedbackDataOnQuizContent = (feedbackData: IQuizFeedback[]) => {
        let mcIndex = -1;
        let saIndex = -1;
        let laIndex = -1;
        const mcFeedback = feedbackData.filter((ele) => ele.type == 'multiple');
        const saFeedback = feedbackData.filter((ele) => ele.type == 'short');
        const laFeedback = feedbackData.filter((ele) => ele.type == 'long');
        setQuizQuestions((prevQuizQuestions) => {
            return prevQuizQuestions.map((question) => {
                if (question.type == 'multiple' && mcFeedback[mcIndex + 1] != undefined) {
                    mcIndex += 1;
                    return {
                        ...question,
                        feedback: mcFeedback[mcIndex].feedback,
                        points: mcFeedback[mcIndex].score,
                    };
                } else if (question.type == 'short' && saFeedback[saIndex + 1] != undefined) {
                    saIndex += 1;
                    return {
                        ...question,
                        feedback: saFeedback[saIndex].feedback,
                        points: saFeedback[saIndex].score,
                    };
                } else if (question.type == 'long' && laFeedback[laIndex + 1] != undefined) {
                    laIndex += 1;
                    return {
                        ...question,
                        feedback: laFeedback[laIndex].feedback,
                        points: laFeedback[laIndex].score,
                    };
                }
                return {
                    ...question,
                };
            });
        });
    };

    const populateDefaultFeedbackData = () => {
        const defaultFeedbackData: IQuizFeedback[] = quizQuestions.map((question) => {
            return {
                type: question.type,
                score: 0,
                feedback: [],
            };
        });

        setAllStudentQuizSubmission((prevAllStudentQuizSubmission) => {
            const newAllStudentQuizSubmission = { ...prevAllStudentQuizSubmission };
            newAllStudentQuizSubmission[currentDisplayStudentSubmission] = {
                answers: [...newAllStudentQuizSubmission[currentDisplayStudentSubmission].answers],
                ai_grade: defaultFeedbackData,
            };
            return newAllStudentQuizSubmission;
        });
    };

    const transferFeedbackToAllStudentQuizSubmission = (
        callback?: (
            newAllStudentQuizSubmission: Record<number, IQuizPerStudentInformation>,
        ) => void,
    ) => {
        setAllStudentQuizSubmission((prevAllStudentQuizSubmission) => {
            if (prevAllStudentQuizSubmission[currentDisplayStudentSubmission] == undefined) {
                return prevAllStudentQuizSubmission;
            }

            const newAllStudentQuizSubmission = { ...prevAllStudentQuizSubmission };
            const newFeedbackData: IQuizFeedback[] = quizQuestions.map((question) => {
                return {
                    type: question.type,
                    score: question.points ?? 0,
                    feedback: question.feedback ?? [],
                };
            });
            newAllStudentQuizSubmission[currentDisplayStudentSubmission] = {
                answers: [...newAllStudentQuizSubmission[currentDisplayStudentSubmission].answers],
                ai_grade: newFeedbackData,
            };

            callback?.(newAllStudentQuizSubmission);

            return newAllStudentQuizSubmission;
        });
    };

    useEffect(() => {
        const studentData = allStudentQuizSubmission[currentDisplayStudentSubmission];
        if (studentData != undefined) {
            setSubmissionDataOnQuizContent(studentData.answers);
            if (typeof studentData.ai_grade !== 'number' && studentData.ai_grade != undefined) {
                setFeedbackDataOnQuizContent(studentData.ai_grade);
                const studentPoints = studentData.ai_grade
                    .map((feedback) => feedback.score)
                    .reduce((accum, currValue) => accum + currValue);
                setCurrentStudentPoints(studentPoints);
            } else {
                populateDefaultFeedbackData();
            }
        }
    }, [allStudentQuizSubmission, currentDisplayStudentSubmission]);

    const fetchBuilderData = (fetchMode?: 'grade') => {
        const queryParams = {
            section: 'get_builder',
            course_id: courseId,
            builder_id: builderId,
            fetch_mode: fetchMode,
        };

        const builderRequest = httpGet<IBuilderResponse>(url, queryParams);

        builderRequest.then((response) => {
            setMode(response.data.mode);
            if (response.data.type === 'text' && response.data.text_content != undefined) {
                setTextContent(response.data.text_content);
                setUpdatedTextContent(response.data.text_content);
            } else if (
                response.data.type == 'quiz_or_assignment' &&
                response.data.quiz_or_assignment_content != undefined
            ) {
                const transformedQuiz = transformQuizQuestions(
                    response.data.quiz_or_assignment_content,
                );

                setQuizTitle(response.data.quiz_or_assignment_content.title);
                setQuizDescription(response.data.quiz_or_assignment_content.description);
                setQuizQuestions(transformedQuiz);
                if (response.data.submission_data != undefined) {
                    setSubmissionDataOnQuizContent(response.data.submission_data);
                }
                if (response.data.mode == 'view') {
                    setQuizSubmission(() => {
                        if (response.data.quiz_or_assignment_content == undefined) {
                            return [];
                        }

                        if (response.data.submission_data != undefined) {
                            return response.data.submission_data;
                        }

                        return transformedQuiz.map((currQuestion) => {
                            if (currQuestion.type == 'multiple') {
                                return {
                                    type: 'multiple',
                                    multiple_value: -1,
                                };
                            } else if (currQuestion.type == 'short') {
                                return {
                                    type: 'short',
                                    short_value: '',
                                };
                            } else {
                                return {
                                    type: 'long',
                                    long_value: undefined,
                                };
                            }
                        });
                    });
                }
                if (
                    fetchMode == 'grade' &&
                    response.data.all_students_submission_data != undefined
                ) {
                    setAllStudentQuizSubmission(
                        response.data.all_students_submission_data.submissions,
                    );
                    setAllSubmittedStudents(
                        response.data.all_students_submission_data.submitted_students,
                    );
                    setCurrentDisplayStudentSubmission(parseInt(passedUserId as string));
                    const totalPoints = transformedQuiz
                        .map((question) => question.points ?? 0)
                        .reduce((accum, currValue) => accum + currValue);
                    setTotalPoints(totalPoints);
                }
            }
            setIsAssignmentCreated(response.data.is_assignment_created);
        });
    };

    useEffect(() => {
        if (passedMode == undefined) {
            fetchBuilderData(undefined);
        } else if (passedMode == 'grade' && passedUserId != undefined) {
            fetchBuilderData('grade');
        }

        setCurrCourseId(parseInt(courseId));
        setCurrBuilderId(parseInt(builderId));
    }, [courseId, builderId, passedMode]);

    useEffect(() => {
        const moduleRequest = httpGet<IModulesResponse>(url, {
            section: 'get_modules',
            course_id: courseId,
        });
        moduleRequest.then((data) => {
            setModules(data.data.data);
            // setModuleId(data.data.data[0].id);
        });
    }, [courseId]);

    const onTextChange = (newContent: string) => {
        setUpdatedTextContent(newContent);
    };

    const onUpdate = () => {
        const queryParams = {
            section: 'update_builder',
            course_id: courseId,
            builder_id: builderId,
        };

        const formData = {
            new_content: JSON.stringify({}),
        };

        if (textContent != undefined) {
            formData.new_content = JSON.stringify({ text: updatedTextContent });
        }

        if (quizQuestions != undefined) {
            const backendQuizContent = {
                title: quizTitle,
                description: quizDescription,
                ...reverseTransformQuizQuestions(quizQuestions),
            };
            formData.new_content = JSON.stringify({ quiz_or_assignment: backendQuizContent });
        }

        const builderRequest = httpPost(`${API_PREFIX}${COURSE_ENDPOINT}`, formData, queryParams);

        builderRequest
            .then(() => {
                //TODO: Add some visual notification it has been saved
                toast.success('Saved Successfully!');
            })
            .catch(() => {
                //TODO: Add some visual notification it has failed
                console.log('Update failed');
            });
    };

    const onAssignmentCreate = () => {
        const queryParams = {
            section: 'create_builder_assignment',
            course_id: courseId,
        };
        const formData = {
            builder_id: builderId,
            name: name,
            due_date: new Date(dueDate).toISOString(),
            module_id: moduleId,
            description: assignmentDescription,
            is_draft: JSON.stringify(isDraft),
        };

        const assignmentCreateRequest = httpPost(url, formData, queryParams);

        assignmentCreateRequest
            .then(() => {
                console.log('Successfully created assignment');
                router.push(`/portal/course_roadmap/${courseId}`);
                toast.success('Assignment created successfully!');
            })
            .catch(() => {
                console.log("Didn't create assignment");
            });
    };

    const onAnswerSelection = (questionIndex: number, value?: string | number | File) => {
        if (quizSubmission[questionIndex].type == 'long' && typeof value === 'object') {
            const queryParams = {
                section: 'create_submission_file',
            };
            const formData = {
                builder_id: builderId,
                file: value,
            };
            const requestResponse = httpPost<ISubmitFileResponse>(url, formData, queryParams);
            requestResponse
                .then((response) => {
                    setQuizSubmission((prevSubmission) => {
                        const newSubmission = [...prevSubmission];
                        newSubmission[questionIndex].long_value = response.data.data;
                        return newSubmission;
                    });
                    setQuizQuestions((prevQuestions) => {
                        return prevQuestions.map((question, currQuestionIndex) => {
                            if (question.type == 'long' && questionIndex == currQuestionIndex) {
                                return {
                                    ...question,
                                    file: response.data.data,
                                };
                            }
                            return question;
                        });
                    });
                })
                .catch(() => {
                    toast.error(
                        "The File couldn't be uploaded. Please check your internet connection and try again.",
                    );
                });

            return;
        }

        if (
            quizSubmission[questionIndex].type == 'long' &&
            quizSubmission[questionIndex].long_value != undefined &&
            value == undefined
        ) {
            const queryParams = {
                section: 'delete_submission_file',
            };
            const formData = {
                builder_id: builderId,
                file_id: quizSubmission[questionIndex].long_value.file_id,
            };

            const requestResponse = httpPost(url, formData, queryParams);
            requestResponse.finally(() => {
                setQuizSubmission((prevSubmission) => {
                    const newSubmission = [...prevSubmission];
                    newSubmission[questionIndex].long_value = undefined;
                    return newSubmission;
                });
                setQuizQuestions((prevQuestions) => {
                    return prevQuestions.map((question, currQuestionIndex) => {
                        if (question.type == 'long' && questionIndex == currQuestionIndex) {
                            return {
                                ...question,
                                file: undefined,
                            };
                        }
                        return question;
                    });
                });
            });

            return;
        }

        setQuizSubmission((prevSubmission) => {
            const newSubmission = [...prevSubmission];
            if (newSubmission[questionIndex].type == 'multiple' && typeof value === 'number') {
                newSubmission[questionIndex].multiple_value = value;
            } else if (newSubmission[questionIndex].type == 'short' && typeof value === 'string') {
                newSubmission[questionIndex].short_value = value;
            }
            return newSubmission;
        });
    };

    const onQuizSubmit = () => {
        console.log('Quiz Submit');

        const queryParams = {
            section: 'submit_builder_assignment',
            course_id: courseId,
        };

        const formData = {
            builder_id: builderId,
            submission: JSON.stringify(quizSubmission),
        };

        const assignmentSubmit = httpPost(url, formData, queryParams);

        assignmentSubmit
            .then(() => {
                toast.success('Successfully submitted assignment');
                router.push(`/portal/course_roadmap/${courseId}`);
            })
            .catch(() => {
                console.log('Something went wrong with the submission');
            });
    };

    const onChangeStudentSubmission = (direction: 'front' | 'back') => {
        transferFeedbackToAllStudentQuizSubmission();

        const selectedStudentIndex = allSubmittedStudents.findIndex(
            (student) => student.id == currentDisplayStudentSubmission,
        );
        if (direction == 'front' && selectedStudentIndex == allSubmittedStudents.length - 1) {
            // This is when you are on the last student and then you try to move forward
            return;
        }

        if (direction == 'back' && selectedStudentIndex == 0) {
            // This is when you are on the first student and then you try to move backward
            return;
        }

        const offsetValue = direction == 'front' ? 1 : -1;
        const newStudentId = allSubmittedStudents[selectedStudentIndex + offsetValue].id;
        setCurrentDisplayStudentSubmission(newStudentId);
    };

    const onUpdateGrades = () => {
        transferFeedbackToAllStudentQuizSubmission((newAllStudentQuizSubmission) => {
            const updateGradesObject: Record<number, IQuizFeedback[]> = {};
            Object.entries(newAllStudentQuizSubmission).forEach(
                ([studentId, studentSubmission]) => {
                    if (
                        studentSubmission.ai_grade != undefined &&
                        typeof studentSubmission.ai_grade !== 'number'
                    ) {
                        updateGradesObject[parseInt(studentId)] = studentSubmission.ai_grade;
                    }
                },
            );

            const formData = {
                builder_id: builderId,
                feedback_data: JSON.stringify(updateGradesObject),
            };

            const queryParams = {
                section: 'submit_builder_grades_and_feedback',
                course_id: courseId,
            };

            const requestResponse = httpPost(url, formData, queryParams);

            requestResponse
                .then(() => {
                    toast.success('Updated Grades');
                })
                .catch(() => {
                    toast.error('Something went wrong');
                });

            console.log(updateGradesObject);
        });
    };

    const getBody = () => {
        if (textContent != undefined) {
            return (
                <Text
                    content={textContent}
                    onSave={onTextChange}
                    allowEdit={permissions?.create_course || false}
                />
            );
        }

        if (quizQuestions != undefined) {
            if (mode == 'edit') {
                return (
                    <AssignmentBuilder
                        mode={'edit'}
                        title={quizTitle}
                        description={quizDescription}
                        quizQuestions={quizQuestions}
                        setQuestions={setQuizQuestions}
                        setQuizDescription={setQuizDescription}
                        setQuizTitle={setQuizTitle}
                    />
                );
            }

            if (mode == 'view') {
                return (
                    <AssignmentBuilder
                        mode={'view'}
                        title={quizTitle}
                        description={quizDescription}
                        quizQuestions={quizQuestions}
                        setQuestions={setQuizQuestions}
                        setQuizDescription={setQuizDescription}
                        setQuizTitle={setQuizTitle}
                        onAnswerSelection={onAnswerSelection}
                        onSubmit={onQuizSubmit}
                    />
                );
            }

            if (mode == 'grade-edit') {
                const selectedStudentIndex = allSubmittedStudents.findIndex(
                    (student) => student.id == currentDisplayStudentSubmission,
                );
                return (
                    <AssignmentBuilder
                        mode="grade-edit"
                        title={quizTitle}
                        description={quizDescription}
                        quizQuestions={quizQuestions}
                        setQuestions={setQuizQuestions}
                        setQuizDescription={setQuizDescription}
                        setQuizTitle={setQuizTitle}
                        onChangeStudentSubmission={onChangeStudentSubmission}
                        gradedPoints={currentStudentPoints}
                        totalPoints={totalPoints}
                        submissionNumber={selectedStudentIndex + 1}
                        totalSubmissions={allSubmittedStudents.length}
                        studentName={allSubmittedStudents[selectedStudentIndex].name}
                    />
                );
            }
        }

        return null;
    };

    const renderAssignmentModal = () => (
        <div className="modalOverlay">
            <div className="modalContent">
                <h3>Create Assignment</h3>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter assignment name..."
                    className="modalInput"
                />
                <label htmlFor={'dueDate'}>Due Date</label>
                <input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="modalInput"
                />
                <label>Module</label>
                <select
                    className="modalInput"
                    value={moduleId ?? -1}
                    onChange={(e) => setModuleId(e.target.value ? parseInt(e.target.value) : -1)}
                >
                    <option value={-1} disabled hidden>
                        No module
                    </option>
                    {modules.map((currModule, index) => (
                        <option key={index} value={currModule.id}>
                            {currModule.title}
                        </option>
                    ))}
                </select>

                <textarea
                    value={assignmentDescription}
                    onChange={(e) => setAssignmentDescription(e.target.value)}
                    placeholder="Enter assignment description..."
                    className="modalInput"
                />
                <label>Draft</label>
                <input
                    type="checkbox"
                    checked={isDraft}
                    onChange={(e) => setIsDraft(e.target.checked)}
                    className="modalInput"
                />

                <div className="modalActions">
                    <button className="modalBtn submit" onClick={onAssignmentCreate}>
                        Create
                    </button>
                    <button
                        className="modalBtn cancel"
                        onClick={() => setShowAssignmentCreateModal(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="builder-page">
            {permissions?.create_course && mode == 'edit' && (
                <div className="action-btns">
                    {!isAssignmentCreated && (
                        <div className="action-btn">
                            <span className="tooltip-text">Create Assignment</span>
                            <Button
                                variant="icon"
                                icon={'/plus.svg'}
                                onClick={() => setShowAssignmentCreateModal(true)}
                            />
                        </div>
                    )}
                    {showAssignmentCreateModal && renderAssignmentModal()}
                    <div className="action-btn">
                        <span className="tooltip-text">Save</span>
                        <Button variant="icon" onClick={onUpdate} icon={'/save.svg'} />
                    </div>
                </div>
            )}
            {mode == 'grade-edit' && (
                <div className="action-btns">
                    <div className="action-btn">
                        <span className="tooltip-text">Save</span>
                        <Button variant="icon" onClick={onUpdateGrades} icon={'/save.svg'} />
                    </div>
                </div>
            )}
            {getBody()}
        </div>
    );
}
