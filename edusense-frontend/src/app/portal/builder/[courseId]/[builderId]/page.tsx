'use client';

import { useParams } from 'next/navigation';
import Text from '../../../../ui_components/Text';
import { useEffect, useState } from 'react';
import { httpGet, httpPost } from '@/app/utils';
import { API_PREFIX, COURSE_ENDPOINT } from '@/app/global';
import { IBuilderResponse } from '@/app/typedef';
import AssignmentBuilder, { AssignmentBuilderProps, Question } from '@/app/ui_components/AssignmentBuilder';
import { useCustomProp } from '@/app/portal/layout';
import Button from '@/app/ui_components/Button';

export default function BuilderPage() {
    const params = useParams();
    const courseId = params.courseId as string;
    const builderId = params.builderId as string;
    
    const { permissions, setCurrCourseId, setCurrBuilderId } = useCustomProp();

    const [textContent, setTextContent] = useState<string | undefined>(undefined);
    const [updatedTextContent, setUpdatedTextContent] = useState<string | undefined>(undefined);

    const [quizContent, setQuizContent] = useState<AssignmentBuilderProps | undefined>(undefined);
    const [updatedQuizContent, setUpdatedQuizContent] = useState<AssignmentBuilderProps | undefined>(undefined);

    useEffect(() => {
        const queryParams = {
            section: 'get_builder',
            course_id: courseId,
            builder_id: builderId,
        };

        const builderRequest = httpGet<IBuilderResponse>(
            `${API_PREFIX}${COURSE_ENDPOINT}`,
            queryParams,
        );

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
            }
        });

        setCurrCourseId(parseInt(courseId));
        setCurrBuilderId(parseInt(builderId));
    }, [courseId, builderId]);

    const onQuizChange = (newQuestions: Question[]) => {
        setUpdatedQuizContent((prevUpdatedQuizContent) => {
            if (prevUpdatedQuizContent == undefined) {
                return undefined;
            }
            return {
                ...prevUpdatedQuizContent,
                quizQuestions: newQuestions
            };
        });
    }

    const onDescriptionChange = (newDescription: string) => {
        setUpdatedQuizContent((prevUpdatedQuizContent) => {
            if (prevUpdatedQuizContent == undefined) {
                return undefined;
            }

            return {
                ...prevUpdatedQuizContent,
                description: newDescription
            };
        });
    }

    const onTitleChange = (newTitle: string) => {
        setUpdatedQuizContent((prevUpdatedQuizContent) => {
            if (prevUpdatedQuizContent == undefined) {
                return undefined;
            }

            return {
                ...prevUpdatedQuizContent,
                title: newTitle
            };
        });
    }

    const onTextChange = (newContent: string) => {
        setUpdatedTextContent(newContent);
    }

    const onUpdate = () => {
        const queryParams = {
            section: 'update_builder',
            course_id: courseId,
            builder_id: builderId,
        };

        const formData = {
            new_content: JSON.stringify({})
        }

        if (textContent != undefined) {
            formData.new_content = JSON.stringify({ text: updatedTextContent });
        }

        if (quizContent != undefined) {
            formData.new_content = JSON.stringify({ quiz_or_assignment: updatedQuizContent });
        }

        const builderRequest = httpPost(
            `${API_PREFIX}${COURSE_ENDPOINT}`,
            formData,
            queryParams,
        );

        builderRequest.then(() => {
            //TODO: Add some visual notification it has been saved
            console.log("Updated successfully");
        }).catch(() => {
            //TODO: Add some visual notification it has failed
            console.log("Update failed");
        })
    }

    const getBody = () => {
        if (textContent != undefined) {
            return <Text content={textContent} onSave={onTextChange} />;
        }

        if (quizContent != undefined) {
            return <AssignmentBuilder {...quizContent} onQuizChange={onQuizChange} onDescriptionChange={onDescriptionChange} onTitleChange={onTitleChange} />;
        }

        return null;
    }

    return (
        <div>
            <Button displayName={"Update"} onClick={onUpdate}  />
            {getBody()}
        </div>
    )

}
