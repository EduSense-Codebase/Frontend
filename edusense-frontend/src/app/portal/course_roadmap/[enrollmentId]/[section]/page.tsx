'use client';
import CourseRoadmap from "@/app/ui_components/CourseRoadmap";
import { useParams } from "next/navigation";

export default function SectionRoadmap() {
    const params = useParams()
    const section = params.section as string
    return (
        <>
        <div>
            <h1 className="flex justify-center text-4xl items-center font-bold mb-4 capitalize text-gray-700">{section} Roadmap</h1>

                <CourseRoadmap/>
          
        </div>
        
        </>
    );
}