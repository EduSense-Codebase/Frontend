'use client';
import { useState, useEffect } from 'react';
import { AI_ENDPOINT, API_PREFIX, COURSE_ENDPOINT } from "../global";
import { IJourney, IJourneyResponse, INewEnrollment } from '../typedef';
import { httpPost, httpGet } from '../utils';
import { useParams,useRouter } from 'next/navigation';
import { ArcherContainer, ArcherElement } from 'react-archer';

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
    const section = params.section as string;

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
            } else {
                const cache_query_params = {
                    section: "retrieve_cache",
                    enroll_id: enrollmentId,
                    cache_request: section,
                }

                const API_URL = API_PREFIX + AI_ENDPOINT;
                const cacheResponse = httpGet<IJourneyResponse>(API_URL, cache_query_params);
                cacheResponse.then((response) => {

                    if (response.data.data != null) {
                        console.log("Fetching from the cache...")
                        //console.log(response);
                        const localJourney: IJourney[] = [];
                                response.data.data.description.map((currDescription, index) => {
                                    localJourney.push({
                                        title: response.data.data.title[index],
                                        description: currDescription,
                                    });
                                });
                        setJourney(localJourney);
                    } else {
                        console.log("Manually generating...");
                        const queryParams = {
                            section: "generate_ai_content",
                        };

                        const prompt_parameters = {
                            type: section,
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
                                    cache_request: section,
                                    cache_content: JSON.stringify(response.data.data)
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
          <ArcherContainer strokeColor="black" strokeWidth={2} >
            <div className="w-screen px-8 mx-auto px-4 relative">
              {data.map((step, index) => {
                const isLeft = index % 2 === 1;
                const isLast = index === data.length - 1;
      
                return (
                  <div key={index} className="relative mb-24 ml-35 flex">
                    {isLeft && <div className="w-1/2"></div>}
      
                    <ArcherElement
                      id={`step-${index}`}
                      relations={
                        !isLast
                          ? [{
                              targetId: `step-${index + 1}`,
                              targetAnchor: isLeft ? 'left' : 'right',
                              sourceAnchor: isLeft ? 'right' : 'left',
                              style: { strokeColor: 'black', strokeWidth: 2 },
                            }]
                          : []
                      }
                    >
                      <div className="w-1/3 flex justify-center relative">
                        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
                          {/* Your Link and content */}
                          <Link
                            className="text-xl text-black"
                            href={
                              step.title.toLowerCase().includes("quiz")
                                ? `/portal/course_roadmap/${enrollmentId}/${section}/quiz/${step.title}`
                                : step.title.toLowerCase().includes("test")
                                ? `/portal/course_roadmap/${enrollmentId}/${section}/test/${step.title}`
                                : `/portal/course_roadmap/${enrollmentId}/${section}/article/${step.title}`
                            }
                          >
                            {step.title}
                          </Link>
                          {step.description && (
                            <p className="text-sm text-gray-600 mt-2">{step.description}</p>
                          )}
                        </div>
                      </div>
                    </ArcherElement>
      
                    {!isLeft && <div className="w-1/2"></div>}
                  </div>
                );
              })}
            </div>
          </ArcherContainer>
        );
      };
      
    
        

    return (
        <>
                {renderRoadmap({data: journey})}
        </>
    );
}