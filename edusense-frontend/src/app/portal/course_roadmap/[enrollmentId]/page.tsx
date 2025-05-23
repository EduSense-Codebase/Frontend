'use client';
//import CourseRoadmap from "@/app/ui_components/CourseRoadmap";
import { useState, useEffect } from "react";
import { httpGet } from "@/app/utils";
import { COURSE_ENDPOINT, API_PREFIX } from "@/app/global";
import { useParams, useRouter } from "next/navigation";
import { INewEnrollment } from "@/app/typedef";
import MiniDashboard from "@/app/ui_components/MiniDashboard";
import { mockTasks } from "@/app/typedef";

export default function CourseRoadmapPage() {
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;
    const [roadmaps, setRoadmaps] = useState<string[]>([""]);
    const [showDashboard, setShowDashboard] = useState(false)

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
        <>
        <div className="relative space-y-4 min-h-screen">
      
          <h1 className="text-2xl font-bold text-gray-700">Choose a section to begin</h1>
          <div className="grid grid-cols-1 gap-4">
            {roadmaps.map((roadmap) => (
              <button
                key={roadmap}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() =>
                  router.push(`/portal/course_roadmap/${enrollmentId}/${roadmap.toLowerCase()}`)
                }
              >
                {roadmap}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">...</div>

            {/* Floating To-Do Button */}
            <button
                className="fixed top-24 right-6 z-40 p-3 bg-blue-500 rounded-full shadow-md hover:bg-blue-700"
                onClick={() => setShowDashboard(!showDashboard)}
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path d="M16 4h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1" />
                    <rect width="6" height="4" x="9" y="2" rx="1" />
                    <path d="M9 12h6M9 16h6" />
                </svg>
            </button>

            {/* Dashboard Overlay */}
            {showDashboard && (
            <div className="fixed top-14 right-10 z-50 bg-blue p-3 rounded-full shadow-md hover:bg-blue-100">
                <MiniDashboard tasks={mockTasks} />
            </div>
            )}
        </>
      );
      
}