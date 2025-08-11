'use client';

import { useParams } from "next/navigation";
import Text from "../../../../ui_components/Text"
import { useEffect, useState } from "react";
import { httpGet } from "@/app/utils";
import { API_PREFIX, COURSE_ENDPOINT } from "@/app/global";
import { IBuilderResponse } from "@/app/typedef";


export default function BuilderPage() {
    const params = useParams();
    const courseId = params.courseId as string;
    const builderId = params.builderId as string;

    const [textContent, setTextContent] = useState<string | undefined>(undefined);


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
            }
        })
    }, [courseId, builderId])

    
    if (textContent != undefined) {
        return <Text content={textContent} />
    }

    return null;

}