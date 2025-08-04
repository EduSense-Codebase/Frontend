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
import { useCustomProp } from '../layout';
import { create } from 'domain';
import { error } from 'console';

export default function CourseSection() {
    const { permissions } = useCustomProp();
  
    const [dialogOpen, setDialogOpen] = useState(false);
    const [curAction, setCurAction] = useState('');
    const [createCourseName, setCreateCourseName] = useState('');
    const [joinCode, setJoinCode] = useState('')
    const[loading, setLoading] = useState(false)
    const [courses, setCourses] = useState<ICourse[]>([]);
  
    const join_course = permissions?.join_course;
    const create_course = permissions?.create_course;
    const new_tile = join_course ? "ENROLL COURSE" : create_course ? "CREATE COURSE" : null;

    const backgroundImages: Array<string> = [
        '/course-images/img1.png',
        '/course-images/img2.png',
        '/course-images/img3.jpg',
        '/course-images/img4.jpg',
    ];

    useEffect(() => {
        const courseApiUrl = API_PREFIX + COURSE_ENDPOINT;
        console.log(permissions?.create_course);

        const queryParams = {
            section: join_course ? 'all_enrolled_courses' : create_course ? "all_created_courses": "null",   
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
    }, [permissions]);

  
    const handleDialogClose = () => {
      setDialogOpen(false);
      setCurAction('');
      setCreateCourseName('');
    };
  
    const handleCreateCourseSubmit = () => {

      const apiUrl = API_PREFIX + COURSE_ENDPOINT;
      const formData = {
        course_name: createCourseName,
        institutions: 1
      };
      const queryParams = { section: 'create_course' };
  
      httpPost(apiUrl, formData, queryParams)
        .then((res) => {
          console.log('Course created:', res.data);
          handleDialogClose();
        })
        .catch((err) => {
          console.error('Failed to create course', err);
        });
    };
  
    const handleAction = (action: string) => {
      setCurAction(action);
      setDialogOpen(true)
    };

    const handleJoinCourse = async () => {
        setLoading(true);
        
        const url = API_PREFIX + COURSE_ENDPOINT
        const queryParams = {"section": "enroll_course"}
        const formData = {"join_code":joinCode}

        const requestResponse = httpPost(url, formData, queryParams);
        requestResponse.then((res) => {
            console.log(res.data);
            setCourses((prev) => [...prev, res.data.data]);

        }).catch((error) => {
            console.log("This course does not exist", error)
        })
        setLoading(false)
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
                        <h3 className="course-tile-name">{courseTileArgs.course_name}</h3>
                    </motion.div>
                </Link>
            </>
        );
    };


    return (
      <section>
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
                            <h3 className="course-tile-name">{new_tile}</h3>
                        </motion.div>
                    </button>
                </div>
            </div>
        </div>
  
        {/* Enroll Course Modal */}
        {dialogOpen && join_course && (
          <div className="bg-opacity-20 fixed inset-0 z-50 flex items-center justify-center bg-gray-400 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-gray-700">Enter the join code provided by your teacher to enroll in the course.</h2>
                <div className="grid grid-cols-1 gap-4">
                <input
                    type='text' 
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="w-full rounded border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />



                </div>
                <div className="mt-4 flex justify-end">
                <button
                onClick={handleDialogClose}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                >
                    Close
                </button>

                <button
                    onClick={handleJoinCourse}
                    className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
                    disabled={loading || !joinCode}
                    >
                    {loading ? 'Joining...' : 'Join Course'}
                </button>
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
                <button
                  onClick={handleDialogClose}
                  className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCourseSubmit}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }