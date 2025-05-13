'use client';
//import CourseRoadmap from "@/app/ui_components/CourseRoadmap";
import { useState, useEffect } from "react";
import { httpGet } from "@/app/utils";
import { COURSE_ENDPOINT, API_PREFIX } from "@/app/global";
import { useParams, useRouter } from "next/navigation";
import { INewEnrollment } from "@/app/typedef";


export default function CourseRoadmapPage() {
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;
    const [roadmaps, setRoadmaps] = useState<string[]>([""]);

    const router = useRouter()

    useEffect(() =>{

        const API_URL = API_PREFIX + COURSE_ENDPOINT;
        const queryParams = {
            "section": "course_details",
            enrollment_id: enrollmentId?.toString()
        }
        const request = httpGet<INewEnrollment>(API_URL, queryParams);
        request.then((res) => {
            console.log(res);
            setRoadmaps(res.data.data.roadmaps);
        })
    }, [])

    return (

        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-700">Choose a section to begin</h1>
            <div className="grid grid-cols-1 gap-4">
                {roadmaps.map((roadmap) => (
                <button
                    key={roadmap}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => router.push(`/portal/course_roadmap/${enrollmentId}/${roadmap.toLowerCase()}`)}
                >
                    {roadmap}
                </button>
                ))}
            </div>
        </div>
        //<CourseRoadmap/>
    );
}