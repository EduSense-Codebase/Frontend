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
import '../../theme.css';

export default function CoursesPage() {
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [offeredCourses, setOfferedCourses] = useState<IOfferedCourse[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [curAction, setCurAction] = useState('');
    const backgroundImages: Array<string> = [
        '/course-images/img1.png',
        '/course-images/img2.png',
        '/course-images/img3.jpg',
        '/course-images/img4.jpg',
    ];

    useEffect(() => {
        const courseApiUrl = API_PREFIX + COURSE_ENDPOINT;

        const queryParams = {
            section: 'all_courses',
        };

        const courseResponse = httpGet<IAllEnrolledCourseResponse>(courseApiUrl, queryParams);

        courseResponse
            .then((response) => {
                //console.log(response);
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

    const getBackgroundImage = (courseTileArgs: ICourse): string => {
        const randomIndex = courseTileArgs.id % backgroundImages.length;
        return backgroundImages[randomIndex];
    };

    const renderCourseTile = (courseTileArgs: ICourse, index: number) => {
        const bgImage = getBackgroundImage(courseTileArgs);
        return (
            <>
                <Link
                    id="tile-course-btn"
                    key={courseTileArgs.id}
                    href={`/portal/course_roadmap/${courseTileArgs.id}`}
                    className="inline-block no-underline"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{
                            delay: index * 0.1,
                            duration: 0.4,
                            scale: { type: 'spring', visualDuration: 0.4, bounce: 0.3 },
                        }}
                        className="course-tile"
                    >
                        <div
                            className="course-image"
                            style={{
                                backgroundImage: `url(${bgImage})`,
                            }}
                        />
                        <h3 className="course-tile-name">{courseTileArgs.name}</h3>
                    </motion.div>
                </Link>
            </>
        );
    };

    return (
        <div className="theme-vars theme">
            <h1 className="heading">Dashboard</h1>
            <div className="container">
                <h3 className="subheading">My Courses</h3>
                <div className="cards-container">
                    {courses.map((course, index) => renderCourseTile(course, index))}
                    <button onClick={() => handleAction('enroll_course')}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{
                                delay: courses.length * 0.1, // Delay to appear after all courses
                                duration: 0.4,
                                scale: { type: 'spring', visualDuration: 0.4, bounce: 0.3 },
                            }}
                            className="course-tile"
                            id="enroll-course-tile"
                        >
                            <img src="/plus_icon.png" className="plus-icon" />
                            <h3 className="course-tile-name">ENROLL COURSE</h3>
                        </motion.div>
                    </button>
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
            <div id="start-course-nav" className="footer">
                <button
                    id="manage-courses-btn"
                    onClick={() => handleAction('unenroll_course')}
                    className="button"
                >
                    Manage Courses
                </button>
            </div>
        </div>
    );
}
