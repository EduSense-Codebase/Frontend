'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_PREFIX, COURSE_ENDPOINT } from '../../global';
import { ICourse, ICourseSection, ICourseSectionResponse, IEnrollOrCreateCourseResponse } from '../../typedef';
import { httpGet, httpPost } from '../../utils';
import * as motion from 'motion/react-client';
//import '../../theme.css';
import '../../style/index.scss';
import { useCustomProp } from '@/app/typedef';
import Button from '@/app/ui_components/Button';

export default function CourseSection() {
    const { permissions, courses, setCourses, setCurrCourseId, setCurrBuilderId } = useCustomProp();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [createCourseName, setCreateCourseName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [, setLoading] = useState(false);
    //const [courses, setCourses] = useState<ICourse[]>([]);

    const [courseSections, setCourseSections] = useState<ICourseSection[] | undefined>(undefined);
    const [selectedCourseSection, setSelectedCourseSection] = useState<number | undefined>(undefined);

    const join_course = permissions?.enroll_course;
    const create_course = permissions?.create_course;
    const new_tile = join_course ? 'ENROLL COURSE' : create_course ? 'CREATE COURSE' : 'Neither';

    const backgroundImages: Array<string> = [
        '/course-images/img1.png',
        '/course-images/img2.png',
        '/course-images/img3.jpg',
        '/course-images/img4.jpg',
    ];

    useEffect(() => {
        console.log(permissions?.create_course);

        setCurrCourseId(undefined);
        setCurrBuilderId(undefined);
    }, [permissions]);

    const handleDialogClose = () => {
        setDialogOpen(false);
        setCreateCourseName('');
    };

    const handleCreateCourseSubmit = () => {
        const apiUrl = API_PREFIX + COURSE_ENDPOINT;
        const formData = {
            course_name: createCourseName,
            institution: 1,
        };
        const queryParams = { section: 'create_course' };

        httpPost<IEnrollOrCreateCourseResponse>(apiUrl, formData, queryParams)
            .then((res) => {
                console.log('Course created:', res.data);
                setCourses((prev) => [...prev, res.data.data]);

                handleDialogClose();
            })
            .catch((err) => {
                console.error('Failed to create course', err);
            });
    };

    const handleAction = () => {
        setDialogOpen(true);
    };

    const handleSelectCourse = () => {
        const url = API_PREFIX + COURSE_ENDPOINT;

        const queryParams = {
            section: 'get_sections_from_join_code',
            join_code: joinCode
        }

        const requestResponse = httpGet<ICourseSectionResponse>(url, queryParams);

        requestResponse.then((response) => {
            setCourseSections(response.data.data);
        })
    }

    const handleJoinCourse = async () => {
        setLoading(true);

        const url = API_PREFIX + COURSE_ENDPOINT;
        const queryParams = { section: 'enroll_course' };
        const formData = { join_code: joinCode, section_id: selectedCourseSection };

        const requestResponse = httpPost<IEnrollOrCreateCourseResponse>(url, formData, queryParams);
        requestResponse
            .then((res) => {
                console.log(res.data);
                setCourses((prev) => [...prev, res.data.data]);
            })
            .catch((error) => {
                console.log('This course does not exist', error);
            });
        setLoading(false);
        // Success
        handleDialogClose();
    };

    const getBackgroundImage = (courseTileArgs: ICourse): string => {
        const randomIndex = courseTileArgs.id % backgroundImages.length;
        return backgroundImages[randomIndex];
    };

    const renderCourseTile = (courseTileArgs: ICourse, index: number) => {
        const bgImage = getBackgroundImage(courseTileArgs);
        return (
            <Link
                key={`course-title-${index}`}
                id="tile-course-btn"
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
                    <h3 className="course-tile-name">{courseTileArgs.course_name}</h3>
                </motion.div>
            </Link>
        );
    };

    return (
        <>
            <div className="theme-vars theme">
                <h1 className="heading" data-testid="dashboard-dashboard-title">
                    Dashboard
                </h1>
                <div className="container">
                    <h3 className="subheading">My Courses</h3>
                    <div className="cards-container">
                        {courses?.map((course, index) => renderCourseTile(course, index))}

                        {(join_course || create_course) && (
                            <button onClick={() => handleAction()}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{
                                        delay: courses.length * 0.1,
                                        duration: 0.4,
                                        scale: { type: 'spring', visualDuration: 0.4, bounce: 0.3 },
                                    }}
                                    className="course-tile"
                                    id="enroll-course-tile"
                                >
                                    <img src="/plus_icon.png" className="plus-icon" alt="" />
                                    <h3 className="course-tile-name">{new_tile}</h3>
                                </motion.div>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Enroll Course Modal */}
            {dialogOpen && join_course && (
                <div className="bg-opacity-20 fixed inset-0 z-50 flex items-center justify-center bg-gray-400 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-bold text-gray-700">
                            Enter the join code provided by your teacher to enroll in the course.
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                className="w-full rounded border px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                            {courseSections ? 
                                <select
                                className="modalInput"
                                value={selectedCourseSection}
                                onChange={(e) => setSelectedCourseSection(parseInt(e.target.value))}
                            >
                                {courseSections.map((currSection, index) => (
                                    <option key={index} value={currSection.id}>
                                        {currSection.name}
                                    </option>
                                ))}
                            </select>
                            : null
                            }
                        </div>
                        <div className="mt-4 flex justify-end space-x-4">
                            <Button
                                displayName="Cancel"
                                variant="secondary"
                                onClick={handleDialogClose}
                            />
                            <Button
                                displayName={courseSections ? "Join" : "Select Section"}
                                variant="primary"
                                onClick={courseSections ? handleJoinCourse : handleSelectCourse}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Create Course Modal */}
            {dialogOpen && create_course && (
                <div className="bg-opacity-20 fixed inset-0 z-50 flex items-center justify-center bg-gray-400 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-bold text-gray-700">Create New Course</h2>

                        <input
                            type="text"
                            placeholder="Course Name"
                            value={createCourseName}
                            onChange={(e) => setCreateCourseName(e.target.value)}
                            className="mb-4 w-full rounded border p-2"
                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                displayName="Cancel"
                                variant="secondary"
                                onClick={handleDialogClose}
                            />
                            <Button
                                displayName="Create"
                                variant="primary"
                                onClick={handleCreateCourseSubmit}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
