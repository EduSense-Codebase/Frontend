'use client';
//import CourseRoadmap from "@/app/ui_components/CourseRoadmap";
import { useState, useEffect } from 'react';
import { httpGet } from '@/app/utils';
import { COURSE_ENDPOINT, API_PREFIX } from '@/app/global';
import { useParams, useRouter } from 'next/navigation';
import { INewEnrollment } from '@/app/typedef';
import MiniDashboard from '@/app/ui_components/MiniDashboard';
import { mockTasks } from '@/app/typedef';
import { Step } from 'react-joyride';
import JoyrideWrapper from '@/app/ui_components/JoyrideWrapper';

const sectionSteps: Step[] = [
    {
        target: 'body',
        placement: 'center',
        content: 'This is the section page, where you can go to different sections of the course',
        disableBeacon: true,
    },
    {
        target: '#section-tile',
        content: 'Click on a section when your ready to check out the section roadmap!.',
    },
];

function SectionMetaPanel({
    progress,
    next,
    last,
}: {
    progress: number;
    next: string;
    last: string;
}) {
    return (
        <div className="bg-opacity-90 pointer-events-none absolute top-0 left-0 z-10 h-full w-full rounded-xl bg-white p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {/* Progress */}
            <div className="mb-3">
                <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium">Progress</span>
                    <span className="font-semibold text-blue-700">{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Next + Last Tile Info */}
            <div className="flex justify-between pt-1 text-xs">
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
    const [roadmaps, setRoadmaps] = useState<string[]>(['']);
    const [showDashboard, setShowDashboard] = useState(false);

    const router = useRouter();

    useEffect(() => {


        const url = API_PREFIX + COURSE_ENDPOINT;
        const queryParamsDiag = {
            section: 'course_details',
            enrollment_id: enrollmentId?.toString(),
        };


        const response = httpGet<INewEnrollment>(url, queryParamsDiag);

        response.then((res) =>{
            if(res.data.data.takenDiag == false){
                router.push(`/portal/diagnostic/${enrollmentId}`);
            }else{
                const API_URL = API_PREFIX + COURSE_ENDPOINT;
                const queryParams = {
                    section: 'course_details',
                    enrollment_id: enrollmentId?.toString(),
                };
                const request = httpGet<INewEnrollment>(API_URL, queryParams);
                request.then((res) => {
                    console.log(res);
                    setRoadmaps(res.data.data.roadmaps);
                });
        

            }
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <JoyrideWrapper steps={sectionSteps} seenKey="2" />
            <div className="z-10 flex translate-x-[110%] items-center justify-center bg-white px-6 py-16">
                {/* Centered wrapper */}
                <div className="flex w-full max-w-6xl flex-col items-center justify-center">
                    <h1 className="-mt-10 mb-8 text-center text-4xl font-extrabold text-gray-800">
                        Start your Journey!
                    </h1>

                    {/* Center radial layout */}
                    <div className="mt-10 flex w-full items-center justify-center">
                        <div className="relative h-[500px] w-[500px]">
                            {/* Centered course title */}
                            <div className="absolute top-1/2 left-1/2 z-20 w-[160px] -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-blue-50 p-6 text-center shadow-md">
                                <h1 className="mb-1 text-lg font-bold text-blue-900">Course</h1>
                                <p className="text-sm text-blue-700">Choose your section</p>
                            </div>

                            {/* Orbiting tiles with lines */}
                            {roadmaps.map((roadmap, index) => {
                                const radius = 180;
                                const angle = (index / roadmaps.length) * 2 * Math.PI;
                                const x = radius * Math.cos(angle) * 1.5;
                                const y = radius * Math.sin(angle) * 1.5;

                                return (
                                    <>
                                        {/* Connecting Line */}

                                        <div
                                            className="absolute z-10 bg-blue-200"
                                            style={{
                                                width: `${radius * 1.5}px`, // *2 to match the x multiplier
                                                height: '2px',
                                                top: '50%',
                                                left: '50%',
                                                transformOrigin: 'left center',
                                                transform: `rotate(${(angle * 180) / Math.PI}deg)`,
                                            }}
                                        />

                                        {/* Orbiting Tile */}
                                        <div
                                            id="section-tile"
                                            className="group absolute z-20 cursor-pointer transition-all duration-300"
                                            style={{
                                                top: `calc(50% + ${y}px)`,
                                                left: `calc(50% + ${x}px)`,
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                            onClick={() =>
                                                router.push(
                                                    `/portal/course_roadmap/${enrollmentId}/${roadmap.toLowerCase()}`,
                                                )
                                            }
                                        >
                                            <div className="w-[200px] rounded-xl bg-blue-100 p-4 text-center shadow-md hover:bg-blue-200">
                                                <div className="mb-1 text-2xl">
                                                    {roadmap === 'Reading'
                                                        ? '📖'
                                                        : roadmap === 'Math'
                                                          ? '🧮'
                                                          : '📝'}
                                                </div>
                                                <h3 className="text-md font-semibold text-blue-900">
                                                    {roadmap}
                                                </h3>
                                            </div>

                                            {/* Hover panel */}
                                            <div className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 w-[200px] -translate-x-1/2 transform opacity-0 transition-opacity group-hover:opacity-100">
                                                <SectionMetaPanel
                                                    progress={42}
                                                    next="Functions Quiz"
                                                    last="Intro Article"
                                                />
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
                className="fixed top-24 right-6 z-40 rounded-full bg-blue-500 p-3 shadow-md hover:bg-blue-700"
                onClick={() => setShowDashboard(!showDashboard)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
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
                <div className="fixed top-14 right-10 z-50 rounded-xl bg-white p-3 shadow-xl">
                    <MiniDashboard tasks={mockTasks} />
                </div>
            )}
        </>
    );
}
