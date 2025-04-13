'use client';
import React, { useState,  } from 'react';
import { useRouter, useParams } from 'next/navigation';
//import Link from 'next/link';
import { API_PREFIX, COURSE_ENDPOINT } from "../../../global";
//import { IAllEnrolledCourseResponse, IAllOfferedResponse, ICourse, IOfferedCourse, IUserInfoResponse, INewEnrollment } from '../../../typedef';
import { httpPost } from '../../../utils';
import Input from "../../../ui_components/Input"
import Button from "../../../ui_components/Button"


export default function CourseDiagnostic(){
    const [motivation, setMotivation] = useState("");
    const [skillLevel, setSkillLevel] = useState("");
    const [timeExperience, setTimeExperience] = useState("");

    const router = useRouter();
    const params = useParams();
    const enroll_id = params.enrollmentId as string;



    const handleSubmit =  () => {
        const url = API_PREFIX + COURSE_ENDPOINT;
        const queryParams = {
            section : "post_diagnostic_form" 
        }

        const json_data = JSON.stringify({
            experience: timeExperience,
            motivation,
            skill: skillLevel
        });

        const formData = {
            "course_id" :  enroll_id?.toString(),
            "data": json_data
        }

        const response = httpPost(url, formData, queryParams);
        response.then((res) => {
            console.log("success");
            console.log(res.data);
            router.push(`/portal/course_roadmap/${enroll_id}`);
        }).catch((err) => {
            console.log(err);
        });

        console.log("Input Submitted");


    };

    return (
    <div className="min-h-screen justify-center w-full h-full flex items-center bg-white">
        <div className=" bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-3xl text-gray-700 font-bold mb-8 text-center">Course Diagnostic Form</h2>

        <div className="space-y-6">
            <div>
                <label className="block text-gray-700 font-semibold mb-1">
                What is your motivation for taking this course?
                </label>
                <Input
                type="text"
                placeholder="Motivation"
                value={motivation}
                onChange={setMotivation}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-gray-700 font-semibold mb-1">
                What would you say your current skill level is?
                </label>
                <Input
                type="text"
                placeholder="Skill Level"
                value={skillLevel}
                onChange={setSkillLevel}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-gray-700 font-semibold mb-1">
                How much prior experience do you have with this course (in months)?
                </label>
                <Input
                type="text"
                placeholder="Experience in months"
                value={timeExperience}
                onChange={setTimeExperience}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <br/>
            </div>
            <Button
                displayName='Submit'
                onClick={handleSubmit}
            />
        </div>
    </div>
    );
}