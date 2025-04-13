'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_PREFIX, AUTH_ENDPOINT, COURSE_ENDPOINT } from "../../global";
import { IAllEnrolledCourseResponse, IAllOfferedResponse, ICourse, IOfferedCourse, IUserInfoResponse } from '../../typedef';
import { httpGet } from '../../utils';

export default function CoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [name, setName] = useState("");
  const [offeredCourses, setOfferedCourses] = useState<IOfferedCourse[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [curAction, setCurAction] = useState('');


  useEffect(() => {
    // Example request to fetch user name (using AUTH endpoint)
    const apiUrl = API_PREFIX + AUTH_ENDPOINT;
    //const queryParams = { type: "signin" };
	const response = httpGet<IUserInfoResponse>(apiUrl);
    response.then((response) => {
        console.log('Success:', response.data);
        setName(response.data.data.name);
      })
      .catch((err) => {
        //FIXME: Add Error Handling
		console.log("HELLO 1")
        console.error(err);
      });
      
    // You can also fetch courses here if needed.

    const courseApiUrl = API_PREFIX + COURSE_ENDPOINT;

    let queryParams = {
        section: "all_courses"
    }

    const courseResponse = httpGet<IAllEnrolledCourseResponse>(courseApiUrl, queryParams);

    courseResponse.then((response) => {
        setCourses(response.data.data);
    }).catch((err) => {
        //FIXME: Add Error Handling
    })

  }, []);

  const handleAction = (action: string) => {
    setCurAction(action);
    const apiUrl = API_PREFIX + COURSE_ENDPOINT;
    const queryParams = { section: "all_offered_courses" };
	const response = httpGet<IAllOfferedResponse>(apiUrl, queryParams);
      response.then((res) => {
        setOfferedCourses(res.data.data);
        setDialogOpen(true);
      })
      .catch((err) => console.error('Error fetching offered courses:', err));
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleCourseSelect = (courseID: number, action: string) => {
    /*
    const formData = {
		"course_id" : courseID.toString()
	}

    const apiUrl = API_PREFIX + COURSE_ENDPOINT;
    const queryParams = { section: "enrollment_details" };
	const response = httpGet<IEnrollCourseResponse>(apiUrl, queryParams);

      response.then((res) => {
        if (action === 'enroll_course') {
          setCourses((prev) => [...prev, res.data.data]);
        } else {
          setCourses((prev) => prev.filter((c) => c.id !== res.data.data as any));
        }
      })
      .catch((err) => console.error('Failed', err));

    setDialogOpen(false);
    */
  };

  const renderCourseTile = (courseTileArgs: ICourse) => {
    return (
        <Link key={courseTileArgs.id} href={`/portal/courses/${courseTileArgs.id}`} className="no-underline inline-block">
    <div
      className="w-[250px] h-[250px] flex items-center justify-center rounded-lg text-white text-center transition-transform duration-200 shadow hover:scale-105 hover:shadow-lg active:scale-95"
      style={{ backgroundColor: courseTileArgs.color }}
    >
      <h3 className="text-xl font-bold">{courseTileArgs.name}</h3>
    </div>
  </Link>
    )
  }

  return (
	<>
      <div className="w-full h-full flex flex-wrap justify-start gap-6 mb-10">
        {courses.map((course) => {
            return (
              <>
                {renderCourseTile(course)}
              </>
            )
        })}
      </div>

      {/* Dialog for offered courses */}
      {(() => {
        if (dialogOpen) {
          return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Offered Courses</h2>
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
              {offeredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleCourseSelect(course.id, curAction)}
                  className="cursor-pointer bg-gray-100 p-3 rounded text-center hover:bg-gray-200"
                >
                  {course.course_name}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDialogClose}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" >
                Close
              </button>
            </div>
          </div>
        </div>
      )
        }
      })()}

      {/* Fixed Bottom Bar for Enroll/Unenroll Buttons */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md p-4 flex justify-center gap-4 z-50">
        <button
          onClick={() => handleAction('enroll_course')}
          className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition"
        >
          Enroll Course
        </button>
        <button
          onClick={() => handleAction('unenroll_course')}
          className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
        >
          Delete Course
        </button>
      </div>
	  </>
  );
}