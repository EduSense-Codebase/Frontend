'use client';
import CourseRoadmap from '@/app/ui_components/CourseRoadmap';
import { useParams } from 'next/navigation';
import { Step } from 'react-joyride';
import JoyrideWrapper from '@/app/ui_components/JoyrideWrapper';

const roadmapSteps: Step[] = [
    {
        target: 'body',
        placement: 'center',
        content:
            'This is the roadmap page! Here you can view all the course activities completely generated and personalized to maximize your learning!',
        disableBeacon: true,
    },
];

export default function SectionRoadmap() {
    const params = useParams();
    const section = params.section as string;
    return (
        <>
            <JoyrideWrapper seenKey="3" steps={roadmapSteps} />
            <div>
                <h1 className="mb-4 flex items-center justify-center text-4xl font-bold text-gray-700 capitalize">
                    {section} Roadmap
                </h1>

                <CourseRoadmap />
            </div>
        </>
    );
}
