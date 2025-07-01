'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_PREFIX, COURSE_ENDPOINT } from '../../global';
import {
    IAllEnrolledCourseResponse,
    IAllOfferedResponse,
    ICourse,
    IOfferedCourse,
    INewEnrollment,
} from '../../typedef';
import { httpGet, httpPost } from '../../utils';
import * as motion from 'motion/react-client';

export default function CoursesPage() {
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [offeredCourses, setOfferedCourses] = useState<IOfferedCourse[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [curAction, setCurAction] = useState('');

    useEffect(() => {
        const courseApiUrl = API_PREFIX + COURSE_ENDPOINT;

        const queryParams = {
            section: 'all_courses',
        };

        const courseResponse = httpGet<IAllEnrolledCourseResponse>(courseApiUrl, queryParams);

        courseResponse
            .then((response) => {
                console.log(response);
                setCourses(response.data.data);
            })
            .catch((err) => {
                //FIXME: Add Error Handling
                console.log(err);
            });
    }, []);

    const handleAction = (action: string) => {
        setCurAction(action);
        const apiUrl = API_PREFIX + COURSE_ENDPOINT;
        const queryParams = { section: 'all_offered_courses' };
        const response = httpGet<IAllOfferedResponse>(apiUrl, queryParams);
        response
            .then((res) => {
                setOfferedCourses(res.data.data);
                console.log('All Offered');
                console.log(res.data.data);
                setDialogOpen(true);
            })
            .catch((err) => console.error('Error fetching offered courses:', err));
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleCourseSelect = (courseID: number, action: string) => {
        const formData = {
            course_id: courseID.toString(),
        };

        const apiUrl = API_PREFIX + COURSE_ENDPOINT;
        const queryParams = { section: action };
        const response = httpPost<INewEnrollment>(apiUrl, formData, queryParams);

        response
            .then((res) => {
                if (action === 'enroll_course') {
                    setCourses((prev) => [...prev, res.data.data]);
                    console.log('Response');
                    console.log(res.data.data.name);
                } else {
                    setCourses((prev) => prev.filter((c) => c.id !== (res.data.data as unknown)));
                    console.log('Response');
                    console.log(res.data.data.name);
                }
            })
            .catch((err) => console.error('Failed', err));

        setDialogOpen(false);
    };

    const renderCourseTile = (courseTileArgs: ICourse, index: number) => {
        return (
            <Link
                id="tile-course-btn"
                key={courseTileArgs.id}
                href={`/portal/course_roadmap/${courseTileArgs.id}`}
                className="inline-block no-underline"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        delay: index * 0.1,
                        duration: 0.4,
                        scale: { type: 'spring', visualDuration: 0.4, bounce: 0.3 },
                    }}
                    className="flex h-[250px] w-[250px] items-center justify-center rounded-lg text-center text-white shadow transition-transform duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                    style={{ backgroundColor: courseTileArgs.color }}
                >
                    <h3 className="text-xl font-bold">{courseTileArgs.name}</h3>
                </motion.div>
            </Link>
        );
    };

    return (
        <>
            <div className="mb-10 h-full w-full">
                <h1 className="mb-6 text-3xl font-bold text-gray-700">Dashboard</h1>
                <div className="flex flex-wrap justify-start gap-6">
                    {courses.map((course, index) => renderCourseTile(course, index))}
                </div>
            </div>

            {/* Dialog for offered courses */}
            {(() => {
                if (dialogOpen) {
                    return (
                        <div
                            id="course-modal"
                            className="bg-opacity-20 fixed inset-0 z-50 flex items-center justify-center bg-gray-400 backdrop-blur-sm"
                        >
                            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                                <h2 className="mb-4 text-xl font-bold text-gray-700">
                                    Offered Courses
                                </h2>
                                <div className="flex max-h-[300px] flex-col gap-3 overflow-y-auto text-gray-700">
                                    {offeredCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            onClick={() => handleCourseSelect(course.id, curAction)}
                                            className="cursor-pointer rounded bg-gray-100 p-3 text-center hover:bg-gray-200"
                                        >
                                            {course.course_name}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={handleDialogClose}
                                        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }
            })()}

            {/* Fixed Bottom Bar for Enroll/Unenroll Buttons */}
            <div
                id="start-course-nav"
                className="fixed bottom-0 left-0 z-50 flex w-full justify-center gap-4 border-t border-gray-200 bg-white p-4 shadow-md"
            >
                <button
                    id="start-course-btn"
                    onClick={() => handleAction('enroll_course')}
                    className="rounded bg-green-500 px-6 py-2 text-white transition hover:bg-green-600"
                >
                    Enroll Course
                </button>
                <button
                    onClick={() => handleAction('unenroll_course')}
                    className="rounded bg-red-500 px-6 py-2 text-white transition hover:bg-red-600"
                >
                    Delete Course
                </button>
            </div>
        </>
    );
}
