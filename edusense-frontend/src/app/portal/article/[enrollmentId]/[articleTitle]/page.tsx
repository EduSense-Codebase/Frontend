'use client';
import { useState, useEffect } from 'react';
import { AI_ENDPOINT, API_PREFIX } from "../../../../global";
import { IArticleResponse, IJourney, IJourneyResponse } from '../../../../typedef';
import { httpPost } from '../../../../utils';
import { useParams } from 'next/navigation';

import ReactMarkdown from "react-markdown"
import { useCustomProp } from '@/app/portal/layout';

export default function CourseRoadmap() {
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;
    const articleTitle = params.articleTitle as string;

    const [article, setArticle] = useState<string>("");

    const layoutProps = useCustomProp();

    useEffect(() => {
        let queryParams = {
            section: "generate_ai_content"
        }

        let prompt_parameters = {
            "title": articleTitle
        }

        let formData = {
            enrollment_id: enrollmentId,
            prompt_type: "article",
            prompt_parameters: JSON.stringify(prompt_parameters)
        }
        
        const API_URL = API_PREFIX + AI_ENDPOINT;

        const requestResponse = httpPost<IArticleResponse>(API_URL, formData, queryParams)

        requestResponse.then((response) => {
            console.log(response.data);
            setArticle(response.data.data.article);
            layoutProps.setPageContext(response.data.data.article);
            layoutProps.setEnrollmentId(parseInt(enrollmentId));
        })
    }, [])

    const renderArticle = () => {
        return (
            <div className="relative w-full flex flex-col px-4 text-black">
                <ReactMarkdown>{article}</ReactMarkdown>
            </div>
        )
    }

    return (
        <>
            <div className="w-full h-full flex flex-wrap justify-start gap-6 mb-10">
                {renderArticle()}
            </div>
        </>
    );
}