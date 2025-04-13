'use client';
import { useState, useEffect } from 'react';
import { AI_ENDPOINT, API_PREFIX } from "../../../global";
import { IJourney, IJourneyResponse } from '../../../typedef';
import { httpPost } from '../../../utils';
import { useParams } from 'next/navigation';

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

    useEffect(() => {
        let queryParams = {
            section: "generate_ai_content"
        }

        let prompt_parameters = {
            level: "beginner"
        }

        let formData = {
            enrollment_id: enrollmentId,
            prompt_type: "roadmap",
            prompt_parameters: JSON.stringify(prompt_parameters)
        }
        
        const API_URL = API_PREFIX + AI_ENDPOINT;

        const requestResponse = httpPost<IJourneyResponse>(API_URL, formData, queryParams)

        requestResponse.then((response) => {
            console.log(response.data);
            let localJourney: IJourney[] = []
            response.data.data.description.map((currDescription, index) => {
                localJourney.push({title: response.data.data.title[index], description: currDescription});
            })
            setJourney(localJourney);
        })
    }, [])

    const renderRoadmap = ({ data }: Props) => {
        return (
            <div className="relative w-full flex flex-col px-4">
                {data.map((step, index) => {
                    const isLeft = index % 2 === 0
                    const isLast = index === data.length - 1

                    return (
                    <div key={index} className="relative w-full mb-16">
                        <div className="flex justify-between items-center w-full">

                        {/* Left Card */}
                        {isLeft && (
                            <div className="w-1/2 pr-6 flex justify-end">
                            <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-right border border-gray-200">
                                <h3 className="text-xl text-black">{step.title}</h3>
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
                                <h3 className="text-xl text-black">{step.title}</h3>
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