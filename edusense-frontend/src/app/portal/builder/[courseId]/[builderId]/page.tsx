'use client';

import { useParams } from "next/navigation";
import Text from "../../../../ui_components/Text"
import { useEffect, useState } from "react";
import { httpGet } from "@/app/utils";
import { API_PREFIX, COURSE_ENDPOINT } from "@/app/global";
import { IBuilderResponse } from "@/app/typedef";
import AssignmentBuilder, { AssignmentBuilderProps } from "@/app/ui_components/AssignmentBuilder";


export default function BuilderPage() {
    const params = useParams();
    const courseId = params.courseId as string;
    const builderId = params.builderId as string;

    const [textContent, setTextContent] = useState<string | undefined>(undefined);

    const [quizContent, setQuizContent] = useState<AssignmentBuilderProps | undefined>(undefined);


    useEffect(() => {
        const queryParams = {
            section: "get_builder",
            course_id: courseId,
            builder_id: builderId
        }

        const builderRequest = httpGet<IBuilderResponse>(`${API_PREFIX}${COURSE_ENDPOINT}`, queryParams)

        builderRequest.then((response) => {
            if (response.data.type === "text" && response.data.text_content != undefined) {
                setTextContent(response.data.text_content);
            } else if (response.data.type == "quiz_or_assignment" && response.data.quiz_or_assignment_content != undefined) {
                setQuizContent(response.data.quiz_or_assignment_content);
            }
        })
    }, [courseId, builderId])

    
    if (textContent != undefined) {
        return <Text content={textContent} />
    }

    if (quizContent != undefined) {
        return <AssignmentBuilder {...quizContent} />
    }

    return null;

}