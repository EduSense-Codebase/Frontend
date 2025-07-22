'use client';
//import CourseRoadmap from "@/app/ui_components/CourseRoadmap";
import { useState, useEffect } from 'react';
import { httpGet } from '@/app/utils';
import { COURSE_ENDPOINT, API_PREFIX } from '@/app/global';
import { useParams, useRouter } from 'next/navigation';
import { INewEnrollment } from '@/app/typedef';
import { Step } from 'react-joyride';
import JoyrideWrapper from '@/app/ui_components/JoyrideWrapper';
import { useCustomProp } from '@/app/portal/layout';
import '../../../theme.css';
import { motion } from "framer-motion";


export const runtime = 'edge';

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
        disableBeacon: true,
    },
];

// function SectionMetaPanel({
//     progress,
//     next,
//     last,
// }: {
//     progress: number;
//     next: string;
//     last: string;
// }) {
//     return (
//         <div className="bg-opacity-90 pointer-events-none absolute top-0 left-0 z-10 h-full w-full rounded-xl bg-white p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//             {/* Progress */}
//             <div className="mb-3">
//                 <div className="mb-1 flex justify-between text-xs">
//                     <span className="font-medium">Progress</span>
//                     <span className="font-semibold text-blue-700">{progress}%</span>
//                 </div>
//                 <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
//                     <div
//                         className="h-2 rounded-full bg-blue-600"
//                         style={{ width: `${progress}%` }}
//                     ></div>
//                 </div>
//             </div>

//             {/* Next + Last Tile Info */}
//             <div className="flex justify-between pt-1 text-xs">
//                 <div>
//                     <div className="text-gray-500">Next</div>
//                     <div className="font-medium">{next}</div>
//                 </div>
//                 <div>
//                     <div className="text-gray-500">Last</div>
//                     <div className="font-medium">{last}</div>
//                 </div>
//             </div>
//         </div>
//     );
// }

export default function CourseRoadmapPage() {
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;
    const [roadmaps, setRoadmaps] = useState<string[]>(['']);
    const [courseName, setCourseName] = useState<string>('');
    const pageContexts =
        'This page is an section page where users can select the various sections of the course to do work.';

    const router = useRouter();
    const layoutProps = useCustomProp();

    useEffect(() => {
        const url = API_PREFIX + COURSE_ENDPOINT;
        const queryParamsDiag = {
            section: 'course_details',
            enrollment_id: enrollmentId?.toString(),
        };

        const response = httpGet<INewEnrollment>(url, queryParamsDiag);

        response.then((res) => {
            if (res.data.data.takenDiag == false) {
                router.push(`/portal/diagnostic/${enrollmentId}`);
            } else {
                const API_URL = API_PREFIX + COURSE_ENDPOINT;
                const queryParams = {
                    section: 'course_details',
                    enrollment_id: enrollmentId?.toString(),
                };
                const request = httpGet<INewEnrollment>(API_URL, queryParams);
                request.then((res) => {
                    //console.log(res);
                    setRoadmaps(res.data.data.roadmaps);
                    setCourseName(res.data.data.name);
                });
            }
            layoutProps.setEnrollmentId(parseInt(enrollmentId));
            layoutProps.setContext((prev) => ({
                ...prev,
                pageContext: pageContexts,
                roadmap: res.data.data.roadmaps.join(' '),
            }));
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <JoyrideWrapper steps={sectionSteps} seenKey="2" />
            <div className="theme-vars theme">
                {/* Centered wrapper */}
                <div className="flex w-full max-w-6xl flex-col items-center justify-center">
                    <h1 className="heading">Start your Journey!</h1>

                    {/* Center radial layout */}
                    <div className="body-container">
                        <div className="section-container">
                            <p className="subheading" id="section-title">Choose Your Section Below</p>
                            <div className="relative h-[500px] w-[500px]">
                                {/* Centered course title */}
                                <div className="absolute top-1/2 left-1/2 z-20 w-[220px] -translate-x-1/2 -translate-y-1/2 transform">
                                    <div className="relative min-w-[220px] min-h-[220px]">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 20, // time for one full rotation
                                                ease: "linear"
                                            }}>
                                            <img src="/sun.png" className="w-full h-full object-cover" />
                                        </motion.div>
                                        <h1 className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-center text-3xl">{courseName}</h1>
                                    </div>
                                </div>

                                {/* Orbiting tiles with lines */}
                                {roadmaps.map((roadmap, index) => {
                                    const radius = 180;
                                    const angle = (index / roadmaps.length) * 2 * Math.PI;
                                    const x = radius * Math.cos(angle) * 1.5;
                                    const y = radius * Math.sin(angle) * 1.5;
                                    const delay = Math.random() * 2;

                                    return (
                                        <>
                                            {/* Connecting Line */}

                                            <div
                                                className="absolute z-10 bg-[#b5cae7]"
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
                                                <div className="w-[240px] ">
                                                    <div className="relative min-w-[180px] min-h-[180px]">
                                                        <motion.div
                                                            animate={{
                                                                y: [0, -5, 0, 5, 0],
                                                                transition: {
                                                                    duration: 3,
                                                                    delay,
                                                                    repeat: Infinity,
                                                                    ease: "easeInOut",
                                                                },
                                                            }}

                                                            whileHover={{scale: 1.05, transition: { duration: 0.3, ease: "easeInOut" },
                                                            }}
                                                            className="relative w-full h-full"
                                                        >
                                                            <img src='/cloud.png' className='className="w-full h-full object-contain"'/>
                                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-2xl">
                                                                {roadmap === 'Reading'
                                                                    ? '📖'
                                                                    : roadmap === 'Math'
                                                                    ? '🧮'
                                                                    : '📝'}
                                                                <h3 className="text-[var(--dark-blue)] text-3xl">{roadmap}</h3>
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
