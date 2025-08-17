'use client';

import './builder.scss';

import { useParams, useRouter } from 'next/navigation';
import Text from '../../../../ui_components/Text';
import { useEffect, useState } from 'react';
import { httpGet, httpPost } from '@/app/utils';
import { API_PREFIX, COURSE_ENDPOINT } from '@/app/global';
import { IBuilderResponse, IModules, IModulesResponse } from '@/app/typedef';
import AssignmentBuilder, {
    AssignmentBuilderProps,
    Question,
} from '@/app/ui_components/AssignmentBuilder';
import { useCustomProp } from '@/app/portal/layout';
import Button from '@/app/ui_components/Button';

export interface IQuizSubmission {
    type: 'multiple' | 'short' | 'long';
    multiple_value?: number;
    short_value?: string;
    long_value?: string;
}

export default function BuilderPage() {
    const params = useParams();
    const courseId = params.courseId as string;
    const builderId = params.builderId as string;

    const router = useRouter();

    const { permissions, setCurrCourseId, setCurrBuilderId } = useCustomProp();

    const [textContent, setTextContent] = useState<string | undefined>(undefined);
    const [updatedTextContent, setUpdatedTextContent] = useState<string | undefined>(undefined);

    const [quizContent, setQuizContent] = useState<AssignmentBuilderProps | undefined>(undefined);
    const [updatedQuizContent, setUpdatedQuizContent] = useState<
        AssignmentBuilderProps | undefined
    >(undefined);

    const [modules, setModules] = useState<IModules[]>([]);

    const [isAssignmentCreated, setIsAssignmentCreated] = useState(false);
    const [showAssignmentCreateModal, setShowAssignmentCreateModal] = useState(false);

    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [moduleId, setModuleId] = useState(-1);
    const [assignmentDescription, setAssignmentDescription] = useState('');
    const [isDraft, setIsDraft] = useState(false);

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
                setQuizContent(response.data.quiz_or_assignment_content);
                setUpdatedQuizContent(response.data.quiz_or_assignment_content);
                setQuizSubmission((_) => {
                    if (response.data.quiz_or_assignment_content == undefined) {
                        return [];
                    }
                    return response.data.quiz_or_assignment_content.quizQuestions.map(
                        (currQuestion) => {
                            if (currQuestion.type == 'multiple') {
                                return { type: 'multiple', multiple_value: -1 };
                            } else if (currQuestion.type == 'short') {
                                return { type: 'short', short_value: '' };
                            } else {
                                return { type: 'long', long_value: '' };
                            }
                        },
                    );
                });
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
            setModuleId(data.data.data[0].id);
        });
    }, [courseId]);

    const onQuizChange = (newQuestions: Question[]) => {
        setUpdatedQuizContent((prevUpdatedQuizContent) => {
            if (prevUpdatedQuizContent == undefined) {
                return undefined;
            }
            return {
                ...prevUpdatedQuizContent,
                quizQuestions: newQuestions,
            };
        });
    };

    const onDescriptionChange = (newDescription: string) => {
        setUpdatedQuizContent((prevUpdatedQuizContent) => {
            if (prevUpdatedQuizContent == undefined) {
                return undefined;
            }

            return {
                ...prevUpdatedQuizContent,
                description: newDescription,
            };
        });
    };

    const onTitleChange = (newTitle: string) => {
        setUpdatedQuizContent((prevUpdatedQuizContent) => {
            if (prevUpdatedQuizContent == undefined) {
                return undefined;
            }

            return {
                ...prevUpdatedQuizContent,
                title: newTitle,
            };
        });
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

        if (quizContent != undefined) {
            formData.new_content = JSON.stringify({ quiz_or_assignment: updatedQuizContent });
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
            })
            .catch(() => {
                console.log("Didn't create assignment");
            });
    };

    const onAnswerSelection = (questionIndex: number, value: string | number | File) => {
        console.log(`Question Index: ${questionIndex}`);
        console.log(`Value: ${value}`);

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

        if (quizContent != undefined) {
            return (
                <AssignmentBuilder
                    {...quizContent}
                    allowEdit={permissions?.create_course || false}
                    onQuizChange={onQuizChange}
                    onDescriptionChange={onDescriptionChange}
                    onTitleChange={onTitleChange}
                    onAnswerSelection={onAnswerSelection}
                    onSubmit={onQuizSubmit}
                />
            );
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
                    value={moduleId}
                    onChange={(e) => setModuleId(parseInt(e.target.value))}
                >
                    {modules.map((currModule) => (
                        <option value={currModule.id}>{currModule.title}</option>
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
        <div>
            {permissions?.create_course && (
                <>
                    <Button displayName={'Update'} onClick={onUpdate} />
                    {!isAssignmentCreated && (
                        <Button
                            displayName={'Create Assignment'}
                            onClick={() => setShowAssignmentCreateModal(true)}
                        />
                    )}
                    {showAssignmentCreateModal && renderAssignmentModal()}
                </>
            )}
            {getBody()}
        </div>
    );
}
