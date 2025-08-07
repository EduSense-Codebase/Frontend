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
//import '../../../theme.css';
import '../../../style/index.scss'
import { motion } from 'framer-motion';

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

    return <></>;
}
