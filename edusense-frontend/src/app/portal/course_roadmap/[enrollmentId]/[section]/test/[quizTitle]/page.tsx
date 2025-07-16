'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { httpPost } from '../../../../../../utils';
import { AI_ENDPOINT, API_PREFIX, TEST_LENGTH } from '../../../../../../global';
import { IQuiz, IQuizResponse } from '../../../../../../typedef';
import Quiz from '../../../../../../ui_components/Quiz';
//import {motion} from "framer-motion"
import RoadMapNav from '@/app/ui_components/RoadMapNav';

export const runtime = 'edge';

export default function QuizPage() {
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;
    const quizName = decodeURIComponent(params.quizTitle as string);
    const section = params.section as string;
    const [quiz, setQuiz] = useState<IQuiz>();

    useEffect(() => {
        const apiUrl = API_PREFIX + AI_ENDPOINT;
        const queryParams = {
            section: 'generate_ai_content',
        };
        const prompt_parameters = {
            title: quizName,
            length: TEST_LENGTH,
        };
        const formData = {
            enrollment_id: enrollmentId,
            prompt_type: 'quiz_mc',
            prompt_parameters: JSON.stringify(prompt_parameters),
        };

        const response = httpPost<IQuizResponse>(apiUrl, formData, queryParams);
        response.then((response) => {
            console.log(response.data);
            console.log(response.data.data);
            setQuiz(response.data.data);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="flex min-h-screen w-full items-center justify-center bg-white">
                {quiz ? (
                    <Quiz quiz={quiz} title={quizName} />
                ) : (
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-indigo-600" />
                )}
            </div>
            <RoadMapNav enrollmentId={enrollmentId} section={section} />
        </>
    );
}
