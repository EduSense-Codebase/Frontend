'use client';
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
//import Link from 'next/link';
import { API_PREFIX, COURSE_ENDPOINT } from '../../../global';
//import { IAllEnrolledCourseResponse, IAllOfferedResponse, ICourse, IOfferedCourse, IUserInfoResponse, INewEnrollment } from '../../../typedef';
import { httpPost } from '../../../utils';
import Input from '../../../ui_components/Input';
import Button from '../../../ui_components/Button';
import JoyrideWrapper from '@/app/ui_components/JoyrideWrapper';
import { Step } from 'react-joyride';

const diagnosticSteps: Step[] = [
    {
        target: 'body',
        placement: 'center',
        content:
            'This is the diagnostic page! Here you can specify your experience, motivation, and more, so that each section will be personalized to your skill level!',
    },
];

export default function CourseDiagnostic() {
    const [motivation, setMotivation] = useState('');
    const [skillLevel, setSkillLevel] = useState('');
    const [timeExperience, setTimeExperience] = useState('');

    const router = useRouter();
    const params = useParams();
    const enroll_id = params.enrollmentId as string;

    const handleSubmit = () => {
        const url = API_PREFIX + COURSE_ENDPOINT;
        const queryParams = {
            section: 'post_diagnostic_form',
        };

        const json_data = JSON.stringify({
            experience: timeExperience,
            motivation,
            skill: skillLevel,
        });

        const formData = {
            course_id: enroll_id?.toString(),
            data: json_data,
        };

        const response = httpPost(url, formData, queryParams);
        response
            .then((res) => {
                console.log('success');
                console.log(res.data);
                router.push(`/portal/course_roadmap/${enroll_id}`);
            })
            .catch((err) => {
                console.log(err);
            });

        console.log('Input Submitted');
    };

    return (
        <>
            <JoyrideWrapper steps={diagnosticSteps} seenKey="diagKey" />
            <div className="flex h-full min-h-screen w-full items-center justify-center bg-white">
                <div className="rounded-2xl bg-white p-8 shadow-md">
                    <h2 className="mb-8 text-center text-3xl font-bold text-gray-700">
                        Course Diagnostic Form
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">
                                What is your motivation for taking this course?
                            </label>
                            <Input
                                type="text"
                                placeholder="Motivation"
                                value={motivation}
                                onChange={setMotivation}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">
                                What would you say your current skill level is?
                            </label>
                            <Input
                                type="text"
                                placeholder="Skill Level"
                                value={skillLevel}
                                onChange={setSkillLevel}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">
                                How much prior experience do you have with this course (in months)?
                            </label>
                            <Input
                                type="text"
                                placeholder="Experience in months"
                                value={timeExperience}
                                onChange={setTimeExperience}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <br />
                    </div>
                    <Button displayName="Submit" onClick={handleSubmit} />
                </div>
            </div>
        </>
    );
}
