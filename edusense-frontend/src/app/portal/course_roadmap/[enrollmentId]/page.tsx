'use client';
//import CourseRoadmap from "@/app/ui_components/CourseRoadmap";
import { useState, useEffect } from 'react';
import { httpGet, httpPost } from '@/app/utils';
import { COURSE_ENDPOINT, API_PREFIX } from '@/app/global';
import { useParams, useRouter } from 'next/navigation';
import { INewEnrollment, ICourse, IAnnouncements, IAnnouncementsResponse, IAssignments, IAssignmentsResponse, IModules,IModulesResponse } from '@/app/typedef';
import { Step } from 'react-joyride';
import JoyrideWrapper from '@/app/ui_components/JoyrideWrapper';
import { useCustomProp } from '@/app/portal/layout';
import '../../../style/index.scss'
import { motion } from 'framer-motion';

export const runtime = 'edge';
import CourseHomePageUIController from '@/app/Pages/CourseHomePage/CourseHomePageUIController';
import EditCoursePageUIController from '@/app/Pages/EditCoursePage/EditCoursePageUIController';
import Button from '@/app/ui_components/Button';

const sectionSteps: Step[] = [
    {
        target: 'body',
        placement: 'center',
        content: 'This is the section page, where you can go to different sections of the course',
        disableBeacon: true,
    },
    {
        target: '#section-tile',
        content: 'Click on a section when your ready to check out the section roadmap!.',
        disableBeacon: true,
    },
];


export default function HomePage() {
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;

    const { permissions } = useCustomProp();
    const join_course = permissions?.join_course;
    const create_course = permissions?.create_course;

    const [courseDetails, setCourseDetails] = useState<ICourse>();
    const [announcements, setAnnouncements] = useState<IAnnouncements[]>([])
    const [assignments, setAssignments] = useState<IAssignments[]>([])
    const [modules, setModules] = useState<IModules[]>([])
    const [editMode, setEditMode] = useState(false);
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [showToDoWidget, setShowToDoWidget] = useState(false);
    const [showModuleWidget, setShowModuleWidget] = useState(false);
    const [originalValues, setOriginalValues] = useState<any>(null);

    const router = useRouter();


    useEffect(() => {
        // Get necessary info to display on Overview page
        const url = API_PREFIX + COURSE_ENDPOINT
        const queryParams = {"section": "course_details", "course_id":enrollmentId}
        const requestResponse = httpGet<INewEnrollment>(url,queryParams);
        requestResponse.then((res) => {
            console.log(res.data)
            setCourseDetails(res.data.data)
        }).catch((err) => {
            console.log(err)
            console.log(enrollmentId)
        })

        const queryParamsAnnounce = {"section": "get_announcements", "course_id":enrollmentId}
        const requestResponseAnnounce = httpGet<IAnnouncementsResponse>(url,queryParamsAnnounce);
        requestResponseAnnounce.then((res) => {
            console.log(res.data)
            setAnnouncements(res.data.data)
        }).catch((err) => {
            console.log(err)
            console.log(enrollmentId)
        })

        const queryParamsAssign = {"section": "get_assignments", "course_id":enrollmentId}
        const requestResponseAssign = httpGet<IAssignmentsResponse>(url,queryParamsAssign);
        requestResponseAssign.then((res) => {
            console.log(res.data)
            setAssignments(res.data.data)
        }).catch((err) => {
            console.log(err)
            console.log(enrollmentId)
        })

        const queryParamsMod = {"section": "get_modules", "course_id":enrollmentId}
        const requestResponseMod = httpGet<IModulesResponse>(url,queryParamsMod);
        requestResponseMod.then((res) => {
            console.log(res.data)
            setModules(res.data.data)
        }).catch((err) => {
            console.log(err)
            console.log(enrollmentId)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreateAnnouncement = (title: string, content: string) => {
        const url = API_PREFIX + COURSE_ENDPOINT;
        const formData = { title, content };
        const queryParams = { section: "make_announcement" };
    
        const requestResponse = httpPost(url, formData, queryParams);
        requestResponse.then((res) => {
            console.log(res.data);
            setAnnouncements((prev) => [
                ...prev,
                { title, content } // using the params directly
            ]);
        }).catch((err) => {
            console.log(err);
            console.log(enrollmentId);
        });
    };

    const enterEditMode = () => {
        setEditMode(true);
        setOriginalValues({
          bannerImage,
          showModuleWidget,
          showToDoWidget,
        });
    };
    

    return (
        <>
          {editMode ? (
            <EditCoursePageUIController
              course={courseDetails}
              editMode={editMode}
              setEditMode={setEditMode}
              bannerImage={bannerImage}
              allModules={modules}
              showToDoWidget={showToDoWidget}
              showModuleWidget={showModuleWidget}
              setShowModuleWidget={setShowModuleWidget}
              setBannerImage={setBannerImage}
              setShowToDoWidget={setShowToDoWidget}
              originalValues={originalValues}
            />
          ) : (
            <>
              <CourseHomePageUIController
                joinCourse={true} // or your permission logic here
                createCourse={true} // likewise
                courseDetails={courseDetails}
                announcements={announcements}
                assignments={assignments}
                onPostAnnouncement={handleCreateAnnouncement}
                bannerImage={bannerImage}
                allModules={modules}
                showToDoWidget={showToDoWidget}
                showModuleWidget={showModuleWidget}
              />
    
              <div className="edit-btn-container">
                <Button
                  displayName="Edit Page"
                  onClick={enterEditMode}
                  variant="primary"
                  icon="/edit.svg"
                />
              </div>
            </>
          )}
        </>
      );
}
