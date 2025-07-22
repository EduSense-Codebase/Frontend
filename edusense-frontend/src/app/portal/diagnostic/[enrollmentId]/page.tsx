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
import MCInput from '../../../ui_components/MCInput';
import '../../../theme.css';

export const runtime = 'edge';

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
            <div className="theme-vars flex flex-col gap-5 h-full min-h-screen w-full items-center justify-center bg-white">
                <h2 className="heading">
                    Course Diagnostic Form
                </h2>
                    <div className="space-y-6">
                        <MCInput 
                            label="What is your motivation for taking this course?"
                            options={["Enrichment", "Practice", "Self motivated", "Struggling"]}
                            name="motivation"
                            selectedValue={motivation}
                            onChange={setMotivation}
                        />

                        <MCInput 
                            label="What would you say your current skill level is?"
                            options={["Novice", "Intermediate", "Advanced"]}
                            name="skill-level"
                            selectedValue={skillLevel}
                            onChange={setSkillLevel}
                        />

                        <MCInput 
                            label="How much prior experience do you have with this course (in months)?"
                            options={["0 months", "1-4 months", "5+ months"]}
                            name="time-experience"
                            selectedValue={timeExperience}
                            onChange={setTimeExperience}
                        />
                    </div>
                    <button onClick={handleSubmit} className='button'>
                        Submit
                    </button>
            </div>
        </>
    );
}
