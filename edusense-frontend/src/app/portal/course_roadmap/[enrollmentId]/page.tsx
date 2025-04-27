'use client';
import { useState, useEffect } from 'react';
import { AI_ENDPOINT, API_PREFIX, COURSE_ENDPOINT } from "../../../global";
import { IJourney, IJourneyResponse, INewEnrollment } from '../../../typedef';
import { httpPost, httpGet } from '../../../utils';
import { useParams,useRouter } from 'next/navigation';
import Link from 'next/link';

/* Local Type Defs */
type Step = {
  title: string
  description?: string
}

type Props = {
  data: Step[]
}

export default function CourseRoadmap() {
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;

    const [journey, setJourney] = useState<IJourney[]>([]);
    const router = useRouter();
    
    useEffect(() => {
        const url = API_PREFIX + COURSE_ENDPOINT
        const queryParams = {
            section: "course_details",
			enrollment_id: enrollmentId?.toString()
        }
       
        const response = httpGet<INewEnrollment>(url, queryParams);
        response.then((res) => {
            console.log(res.data.data);
            if(res.data.data.takenDiag == false){
                router.push(`/portal/diagnostic/${enrollmentId}`);
            }else{

                const cache_query_params = {
                    section: "retrieve_cache",
                    enroll_id: enrollmentId,
                    cache_request: "roadmap"
                }

                const API_URL = API_PREFIX + AI_ENDPOINT;
                const cacheResponse = httpGet<IJourneyResponse>(API_URL, cache_query_params);
                cacheResponse.then((response) => {

                    if(response.data.data != null){
                        console.log("Fetching from the cache...")
                        console.log(response);
                        const localJourney: IJourney[] = [];
                                response.data.data.description.map((currDescription, index) => {
                                    localJourney.push({
                                        title: response.data.data.title[index],
                                        description: currDescription,
                                    });
                                });
                        setJourney(localJourney);
                    }else{
                        console.log("Manually generating...");
                        const queryParams = {
                            section: "generate_ai_content",
                        };

                        const prompt_parameters = {
                            level: "beginner",
                        };

                        const formData = {
                            enrollment_id: enrollmentId,
                            prompt_type: "roadmap",
                            prompt_parameters: JSON.stringify(prompt_parameters),
                        };

                        httpPost<IJourneyResponse>(API_URL, formData, queryParams)
                            .then((response) => {
                                console.log("Generated AI response:", response.data);

                                const localJourney: IJourney[] = [];
                                response.data.data.description.map((currDescription, index) => {
                                    localJourney.push({
                                        title: response.data.data.title[index],
                                        description: currDescription,
                                    });
                                });

                                setJourney(localJourney)

                                const cacheSaveParams = {
                                    section: "set_cache_content"
                                }
                                
                                const cacheSaveData = {
                                    enroll_id: enrollmentId,
                                    cache_request: "roadmap",
                                    cache_content: JSON.stringify(response.data.data),

                                }
                                const cachePost = httpPost(API_URL, cacheSaveData, cacheSaveParams);
                                cachePost.then((res) => {
                                    console.log(res);
                                }).catch((error) => {
                                    console.log("ERROR setting the cache");
                                    console.log(error);
                                });
                            }).catch((err) => {
                                console.log("Generating Error");
                                console.log(err);
                            });


                    }
                })

            }
        })



    }, [])

    const renderRoadmap = ({ data }: Props) => {
        return (
            <div className="relative w-full flex flex-col px-4">
                {data.map((step, index) => {
                    const isLeft = index % 2 === 0
                    //const isLast = index === data.length - 1

                    return (
                    <div key={index} className="relative w-full mb-16">
                        <div className="flex justify-between items-center w-full">

                        {/* Left Card */}
                        {isLeft && (
                            <div className="w-1/2 pr-6 flex justify-end">
                            <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-right border border-gray-200">
                                <Link className="text-xl text-black" href={
                                     step.title.toLowerCase().includes("quiz")
                                     ? `/portal/quiz/${enrollmentId}/${step.title}`
                                     : `/portal/article/${enrollmentId}/${step.title}`
                                }>{step.title}</Link>
                                {step.description && (
                                <p className="text-sm text-gray-600 mt-2">{step.description}</p>
                                )}
                            </div>
                            </div>
                        )}

                        {/* Right Card */}
                        {!isLeft && (
                            <div className="w-1/2 pl-6 flex justify-start">
                            <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-left border border-gray-200">
                                <Link className="text-xl text-black" href={
                                     step.title.toLowerCase().includes("quiz")
                                     ? `/portal/quiz/${enrollmentId}/${step.title}`
                                     : `/portal/article/${enrollmentId}/${step.title}`
                                }>{step.title}</Link>
                                {step.description && (
                                <p className="text-sm text-gray-600 mt-2">{step.description}</p>
                                )}
                            </div>
                            </div>
                        )}
                        </div>
                    </div>
                    )
                })}
            </div>
        )
    }

    return (
        <>
            <div className="w-full h-full flex flex-wrap justify-start gap-6 mb-10">
                {renderRoadmap({data: journey})}
            </div>
        </>
    );
}