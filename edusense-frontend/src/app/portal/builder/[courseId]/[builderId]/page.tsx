'use client';

export const runtime = 'edge';

import './builder.scss';

import { useParams, useRouter } from 'next/navigation';
import Text from '../../../../ui_components/Text';
import { useEffect, useState } from 'react';
import { httpGet, httpPost } from '@/app/utils';
import { API_PREFIX, COURSE_ENDPOINT } from '@/app/global';
import { IBuilderResponse, IModules, IModulesResponse } from '@/app/typedef';
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
    long_value?: string;
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
            description: longConfig.description,
        };
        quizQuestions.push(assembledQuestion);
    });

    // Sort by order index

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

    /* Change Quiz Content Tracker */
    const [updatedQuizTitle, setUpdateQuizTitle] = useState('');
    const [updatedQuizDescription, setUpdatedQuizDescription] = useState('');
    const [updatedQuizQuestions, setUpdatedQuizQuestions] = useState<Question[]>([]);

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

    const url = `${API_PREFIX}${COURSE_ENDPOINT}`;

    useEffect(() => {
        const queryParams = {
            section: 'get_builder',
            course_id: courseId,
            builder_id: builderId,
        };

        const builderRequest = httpGet<IBuilderResponse>(url, queryParams);

        builderRequest.then((response) => {
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
                if (response.data.submission_data != undefined) {
                    // This means this is a submit submission to show
                    const submissionData = response.data.submission_data;
                    transformedQuiz.forEach((question, index) => {
                        if (
                            question.type == 'multiple' &&
                            submissionData[index].type == 'multiple'
                        ) {
                            question.selectedOptionId =
                                question.options[submissionData[index].multiple_value ?? 0].id;
                        } else if (question.type == 'short' && submissionData[index].type) {
                            question.answer = submissionData[index].short_value;
                        } else if (
                            question.type == 'long' &&
                            submissionData[index].type == 'long'
                        ) {
                            //Todo: Fill in Logic for Long Answer Question
                        }
                    });
                }
                setMode(response.data.mode);
                setQuizTitle(response.data.quiz_or_assignment_content.title);
                setQuizDescription(response.data.quiz_or_assignment_content.description);
                setQuizQuestions(transformedQuiz);
                setUpdatedQuizQuestions(transformedQuiz);
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
                                    long_value: '',
                                };
                            }
                        });
                    });
                }
            }
            setIsAssignmentCreated(response.data.is_assignment_created);
        });

        setCurrCourseId(parseInt(courseId));
        setCurrBuilderId(parseInt(builderId));
    }, [courseId, builderId]);

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

    const onQuizChange = (newQuestions: Question[]) => {
        setUpdatedQuizQuestions(newQuestions);
    };

    const onDescriptionChange = (newDescription: string) => {
        setUpdatedQuizDescription(newDescription);
    };

    const onTitleChange = (newTitle: string) => {
        setUpdateQuizTitle(newTitle);
    };

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
                title: updatedQuizTitle,
                description: updatedQuizDescription,
                ...reverseTransformQuizQuestions(updatedQuizQuestions),
            };
            formData.new_content = JSON.stringify({ quiz_or_assignment: backendQuizContent });
        }

        const builderRequest = httpPost(`${API_PREFIX}${COURSE_ENDPOINT}`, formData, queryParams);

        builderRequest
            .then(() => {
                //TODO: Add some visual notification it has been saved
                console.log('Updated successfully');
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
        setQuizSubmission((prevSubmission) => {
            const newSubmission = [...prevSubmission];
            if (newSubmission[questionIndex].type == 'multiple' && typeof value === 'number') {
                newSubmission[questionIndex].multiple_value = value;
            } else if (newSubmission[questionIndex].type == 'short' && typeof value === 'string') {
                newSubmission[questionIndex].short_value = value;
            } else if (newSubmission[questionIndex].type == 'long' && typeof value === 'string') {
                newSubmission[questionIndex].long_value = value;
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
                console.log('Successfully submitted assignment');
                router.push(`/portal/course_roadmap/${courseId}`);
            })
            .catch(() => {
                console.log('Something went wrong with the submission');
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
                        onQuizChange={onQuizChange}
                        onDescriptionChange={onDescriptionChange}
                        onTitleChange={onTitleChange}
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
                        onAnswerSelection={onAnswerSelection}
                        onSubmit={onQuizSubmit}
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
            {permissions?.create_course && (
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
            {getBody()}
        </div>
    );
}
