'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { httpPost, httpGet } from '../../../../../../utils';
import { AI_ENDPOINT, API_PREFIX, QUIZ_LENGTH } from '../../../../../../global';
import { IQuiz, IQuizResponse } from '../../../../../../typedef';
import Quiz from '../../../../../../ui_components/Quiz';
import { useCustomProp } from '@/app/portal/layout'; // this is correct if it's from the layout.tsx directly in /portal
import RoadMapNav from '@/app/ui_components/RoadMapNav';

export default function QuizPage() {
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;
    const quizName = decodeURIComponent(params.quizTitle as string);
    const section = params.section as string;
    const [quiz, setQuiz] = useState<IQuiz>();

    const layoutProps = useCustomProp();
    const contexts = 'This page is a quiz page for students to practice their understanding';

    useEffect(() => {
        const cache_query_params = {
            section: 'retrieve_cache',
            enroll_id: enrollmentId,
            cache_request: quizName,
        };

        const API_URL = API_PREFIX + AI_ENDPOINT;
        httpGet<IQuizResponse>(API_URL, cache_query_params).then((response) => {
            if (response.data.data != null) {
                console.log('Cached');
                console.log(response.data.data);
                setQuiz(response.data.data);
                layoutProps.setEnrollmentId(parseInt(enrollmentId));
                layoutProps.setContext((prev) => ({
                    ...prev,
                    pageContext: contexts,
                    quiz: response.data.data,
                }));
            } else {
                // Not cached yet

                const apiUrl = API_PREFIX + AI_ENDPOINT;
                const queryParams = {
                    section: 'generate_ai_content',
                };
                const prompt_parameters = {
                    title: quizName,
                    length: QUIZ_LENGTH,
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

                    layoutProps.setEnrollmentId(parseInt(enrollmentId));
                    layoutProps.setContext((prev) => ({
                        ...prev,
                        pageContext: contexts,
                        quiz: response.data.data,
                    }));

                    httpPost(
                        API_URL,
                        {
                            enroll_id: enrollmentId,
                            cache_request: quizName,
                            cache_content: JSON.stringify(response.data.data),
                        },
                        { section: 'set_cache_content' },
                    ).then((res) => {
                        console.log(res);
                    });
                });
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="flex min-h-screen w-full items-center justify-center bg-white">
                {quiz ? (
                    <Quiz quiz={quiz} title={quizName} />
                ) : (
                    <div className="h-15 w-15 animate-spin rounded-full border-7 border-gray-500 border-t-indigo-600" />
                )}
            </div>
            <RoadMapNav enrollmentId={enrollmentId} section={section} />
        </>
    );
}
