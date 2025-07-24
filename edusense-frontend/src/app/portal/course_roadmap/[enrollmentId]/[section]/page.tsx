'use client';
import CourseRoadmap from '@/app/ui_components/CourseRoadmap';
import { useParams } from 'next/navigation';
import { Step } from 'react-joyride';
import JoyrideWrapper from '@/app/ui_components/JoyrideWrapper';

export const runtime = 'edge';

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
                <h1
                    className="mx-auto mb-4 flex items-center justify-center text-[5rem] font-bold capitalize"
                    style={{
                        color: '#4b76b3',
                        fontFamily: 'Jua, sans-serif',
                        backgroundColor: '#eff6ff',
                        boxShadow: '0 4px 6px rgba(75, 118, 179, 0.25)',
                        padding: 0,
                        width: '30vw',
                        border: '1px solid #e5e7eb',
                    }}
                >
                    {section} Roadmap
                </h1>

                <CourseRoadmap />
            </div>
        </>
    );
}
