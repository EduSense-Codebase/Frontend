'use client';
import CourseRoadmap from "@/app/ui_components/CourseRoadmap";
import { useParams } from "next/navigation";
import { Step } from "react-joyride";
import JoyrideWrapper from "@/app/ui_components/JoyrideWrapper";


const roadmapSteps: Step[] = [
    {
        target: "body",
        placement: "center",
        content: "This is the roadmap page! Here you can view all the course activities completely generated and personalized to maximize your learning!",
        disableBeacon: false,
    },

]

export default function SectionRoadmap() {
    const params = useParams()
    const section = params.section as string
    return (
        <>
        <JoyrideWrapper seenKey="roadMapSeen" steps={roadmapSteps}/>
        <div>
            <h1 className="flex justify-center text-4xl items-center font-bold mb-4 capitalize text-gray-700">{section} Roadmap</h1>

                <CourseRoadmap/>
          
        </div>
        
        </>
    );
}