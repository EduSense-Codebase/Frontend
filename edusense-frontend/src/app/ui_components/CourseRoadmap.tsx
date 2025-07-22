'use client';
import { useState, useEffect } from 'react';
import { AI_ENDPOINT, API_PREFIX } from '../global';
import { IJourney, IJourneyResponse } from '../typedef';
import { httpPost, httpGet } from '../utils';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCustomProp } from '../portal/layout';

type Step = {
    title: string;
    description?: string;
    type: string;
};

type Props = {
    data: Step[];
};

export default function CourseRoadmap() {
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;
    const section = params.section as string;

    const [journey, setJourney] = useState<IJourney[]>([]);
    const [numCompleted, setNumCompleted] = useState<number>(1);

    const layoutProps = useCustomProp();
    const pageContexts =
        'This page is the roadmap page where the roadmap is generated and the student can choose various tiles in the roadmap, as well as see the progress bar at the top.';

    useEffect(() => {
        const cache_query_params = {
            section: 'retrieve_cache',
            enroll_id: enrollmentId,
            cache_request: section,
        };

        const API_URL = API_PREFIX + AI_ENDPOINT;
        httpGet<IJourneyResponse>(API_URL, cache_query_params).then((response) => {
            if (response.data.data != null) {
                console.log(response.data.data);
                const localJourney: IJourney[] = [];
                response.data.data.description.map((desc, index) => {
                    localJourney.push({
                        title: response.data.data.title[index],
                        description: desc,
                        type: response.data.data.type[index],
                    });
                });
                setJourney(localJourney);
            } else {
                const queryParams = {
                    section: 'generate_ai_content',
                };

                const formData = {
                    enrollment_id: enrollmentId,
                    prompt_type: 'roadmap',
                    prompt_parameters: JSON.stringify({ type: section }),
                };

                httpPost<IJourneyResponse>(API_URL, formData, queryParams).then((response) => {
                    const localJourney: IJourney[] = [];
                    console.log(response.data.data);
                    response.data.data.description.map((desc, index) => {
                        localJourney.push({
                            title: response.data.data.title[index],
                            description: desc,
                            type: response.data.data.type[index],
                        });
                    });

                    setJourney(localJourney);

                    httpPost(
                        API_URL,
                        {
                            enroll_id: enrollmentId,
                            cache_request: section,
                            cache_content: JSON.stringify(response.data.data),
                        },
                        { section: 'set_cache_content' },
                    );
                });
            }

            layoutProps.setEnrollmentId(parseInt(enrollmentId));
            layoutProps.setContext((prev) => ({
                ...prev,
                pageContext: pageContexts,
                roadmap: journey.join(' '),
            }));
            console.log(`layout props roadmap: ${layoutProps.context.roadmap}`);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const renderRoadmap = ({ data }: Props) => {
        const toggleCompletion = (index: number) => {
            if (index < numCompleted) {
                setNumCompleted(index);
            } else if (index === numCompleted) {
                setNumCompleted((prev) => prev + 1);
            }
        };

        const showSpinner = journeyLength === 0;

        return (
            <div className="relative mx-auto w-screen px-4">
                {showSpinner ? (
                    <div className="flex min-h-screen w-full items-center justify-center bg-white">
                        <div className="h-16 w-16 animate-spin rounded-full border-7 border-gray-500 border-t-indigo-600" />
                    </div>
                ) : (
                    data.map((step, index) => {
                        const isLeft = index % 2 === 0;
                        const isCompleted = index < numCompleted;

                        return (
                            <div
                                key={index}
                                className={`relative mb-24 flex flex-col md:flex-row ${
                                    isLeft ? 'md:flex-row-reverse' : ''
                                } items-center justify-between`}
                            >
                                <div className="w-full md:w-1/2"></div>
                                <div className="relative flex w-full justify-center md:w-1/2">
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                        className="relative w-[90%] max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl md:p-8"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                            onClick={() => toggleCompletion(index)}
                                            className={`absolute -top-3 right-5 cursor-pointer rounded-full p-1 shadow-md transition-colors duration-200 ${
                                                isCompleted
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-300 text-black'
                                            }`}
                                            title={
                                                isCompleted
                                                    ? 'Mark as incomplete'
                                                    : 'Mark as complete'
                                            }
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </motion.div>

                                        <Link
                                            className="text-xl font-semibold text-black"
                                            href={
                                                step.title.toLowerCase().includes('quiz')
                                                    ? `/portal/course_roadmap/${enrollmentId}/${section}/quiz/${step.title}`
                                                    : step.title.toLowerCase().includes('test')
                                                      ? `/portal/course_roadmap/${enrollmentId}/${section}/test/${step.title}`
                                                      : step.title
                                                              .toLowerCase()
                                                              .includes('matching activity')
                                                        ? `/portal/course_roadmap/${enrollmentId}/${section}/matching/${step.title}`
                                                        : `/portal/course_roadmap/${enrollmentId}/${section}/article/${step.title}`
                                            }
                                        >
                                            {step.title}
                                        </Link>
                                        {step.description && (
                                            <p className="mt-2 text-sm text-gray-600">
                                                {step.description}
                                            </p>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        );
    };

    // Prevent crash if journey is undefined
    const journeyLength = journey?.length ?? 0;
    const progress = journeyLength > 0 ? (numCompleted / journeyLength) * 100 : 0;

    return (
        <>
            <div className="mx-auto mt-10 mb-10 h-4 w-[90%] rounded-full bg-gray-200">
                <div
                    className="h-4 rounded-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            {renderRoadmap({ data: journey })}
        </>
    );
}
