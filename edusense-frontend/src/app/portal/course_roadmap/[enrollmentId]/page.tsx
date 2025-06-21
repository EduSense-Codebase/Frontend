'use client';
//import CourseRoadmap from "@/app/ui_components/CourseRoadmap";
import { useState, useEffect } from "react";
import { httpGet } from "@/app/utils";
import { COURSE_ENDPOINT, API_PREFIX } from "@/app/global";
import { useParams, useRouter } from "next/navigation";
import { INewEnrollment } from "@/app/typedef";
import MiniDashboard from "@/app/ui_components/MiniDashboard";
import { mockTasks } from "@/app/typedef";
import { Step } from "react-joyride";
import JoyrideWrapper from "@/app/ui_components/JoyrideWrapper";



const sectionSteps: Step[] = [
    {
        target: "body",
        placement: "center",
        content: "This is the section page, where you can go to different sections of the course",
        disableBeacon: true,
    },
    {
        target: '#section-tile',
        content: 'Click on a section when your ready to check out the section roadmap!.',
    },
];

function SectionMetaPanel({ progress, next, last }: { progress: number; next: string; last: string }) {
    return (
    <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-90 rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
        {/* Progress */}
        <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">Progress</span>
            <span className="text-blue-700 font-semibold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
            ></div>
        </div>
        </div>

        {/* Next + Last Tile Info */}
        <div className="flex justify-between text-xs pt-1">
        <div>
            <div className="text-gray-500">Next</div>
            <div className="font-medium">{next}</div>
        </div>
        <div>
            <div className="text-gray-500">Last</div>
            <div className="font-medium">{last}</div>
        </div>
        </div>
    </div>
    );
}

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
         <JoyrideWrapper steps={sectionSteps} seenKey="sectionPage"/>
        <div className=" translate-x-[110%]  flex items-center justify-center bg-white px-6 py-16 z-10">
            {/* Centered wrapper */}
            <div className="w-full max-w-6xl flex flex-col items-center justify-center">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 -mt-10 text-center">
                Start your Journey!
            </h1>

            {/* Center radial layout */}
            <div className="flex justify-center items-center mt-10 w-full">
                <div className="relative w-[500px] h-[500px]">
                {/* Centered course title */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20 bg-blue-50 p-6 rounded-xl shadow-md w-[160px]">
                    <h1 className="text-lg font-bold text-blue-900 mb-1">Course</h1>
                    <p className="text-sm text-blue-700">Choose your section</p>
                </div>

                {/* Orbiting tiles with lines */}
                {roadmaps.map((roadmap, index) => {
                    const radius = 180;
                    const angle = (index / roadmaps.length) * 2 * Math.PI;
                    const x = radius * Math.cos(angle)*1.5;
                    const y = radius * Math.sin(angle)*1.5;

                    return (
                        <>
                        {/* Connecting Line */}
                       
                        <div
                        className="absolute bg-blue-200 z-10"
                        style={{
                            width: `${radius*1.5}px`, // *2 to match the x multiplier
                            height: '2px',
                            top: '50%',
                            left: '50%',
                            transformOrigin: 'left center',
                            transform: `rotate(${(angle * 180) / Math.PI}deg)`,
                        }}
                        />

                        {/* Orbiting Tile */}
                        <div id = "section-tile"
                        className="absolute group transition-all duration-300 cursor-pointer z-20"
                        style={{
                            top: `calc(50% + ${y}px)`,
                            left: `calc(50% + ${x}px)`,
                            transform: 'translate(-50%, -50%)',
                        }}
                        onClick={() =>
                            router.push(`/portal/course_roadmap/${enrollmentId}/${roadmap.toLowerCase()}`)
                        }
                        >
                        <div className="bg-blue-100 hover:bg-blue-200 p-4 rounded-xl shadow-md text-center w-[200px]">
                            <div className="text-2xl mb-1">
                            {roadmap === "Reading" ? "📖" : roadmap === "Math" ? "🧮" : "📝"}
                            </div>
                            <h3 className="text-md font-semibold text-blue-900">{roadmap}</h3>
                        </div>

                        {/* Hover panel */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-[200px]">
                            <SectionMetaPanel progress={42} next="Functions Quiz" last="Intro Article" />
                        </div>
                        </div>
                    </>
                    );
                })}
                </div>
            </div>
            </div>
        </div>

        {/* To-do button and dashboard */}
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

        {showDashboard && (
            <div className="fixed top-14 right-10 z-50 bg-white p-3 rounded-xl shadow-xl">
            <MiniDashboard tasks={mockTasks} />
            </div>
        )}
        </>

    );
}