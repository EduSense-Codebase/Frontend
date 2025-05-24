'use client';
import CourseRoadmap from "@/app/ui_components/CourseRoadmap";
import { useParams } from "next/navigation";

export default function SectionRoadmap() {
    const params = useParams()
    const section = params.section as string
    return (
        <div>
            <h1 className="text-2xl font-bold mb-10 capitalize text-gray-700">{section} Roadmap</h1>
  
            <CourseRoadmap/>
        </div>

    );
}