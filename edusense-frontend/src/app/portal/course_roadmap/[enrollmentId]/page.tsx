'use client';

//import CourseRoadmap from "@/app/ui_components/CourseRoadmap";
import { useState, useEffect } from 'react';
import { httpGet, httpPost } from '@/app/utils';
import { COURSE_ENDPOINT, API_PREFIX } from '@/app/global';
import { useParams } from 'next/navigation';
import {
    INewEnrollment,
    ICourse,
    IAnnouncements,
    IAnnouncementsResponse,
    IAssignments,
    IAssignmentsResponse,
    IModules,
    IModulesResponse,
    IStudentData,
    IStudentDataResponse,
    IFile,
    IFileResponse,
} from '@/app/typedef';
// import JoyrideWrapper from '@/app/ui_components/JoyrideWrapper';
import { useCustomProp } from '@/app/typedef';
import '../../../style/index.scss';
// import { motion } from 'framer-motion';

export const runtime = 'edge';
import CourseHomePageUIController from '@/app/Pages/CourseHomePage/CourseHomePageUIController';
import EditCoursePageUIController from '@/app/Pages/EditCoursePage/EditCoursePageUIController';
import Button from '@/app/ui_components/Button';

export default function HomePage() {
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;

    const { permissions, setCurrCourseId, setCurrBuilderId } = useCustomProp();
    const join_course = permissions?.join_course;
    const create_course = permissions?.create_course;

    const edit = permissions?.edit
    // const upload = permissions?.upload
    // const create = permissions?.create
    // const grade= permissions?.create

    const [courseDetails, setCourseDetails] = useState<ICourse>();
    const [announcements, setAnnouncements] = useState<IAnnouncements[]>([]);
    const [assignments, setAssignments] = useState<IAssignments[]>([]);
    const [modules, setModules] = useState<IModules[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [showToDoWidget, setShowToDoWidget] = useState(false);
    const [showModuleWidget, setShowModuleWidget] = useState(false);
    const [originalValues, setOriginalValues] = useState<any>(null);
    const [students, setStudents] = useState<IStudentData[]>([]);
    const [files, setFiles] = useState<IFile[]>([]);
    const [classModule, setClassModule] = useState('');

    useEffect(() => {
        const url = API_PREFIX + COURSE_ENDPOINT;
        setCurrBuilderId(undefined);
        Promise.all([
            httpGet<INewEnrollment>(url, { section: 'course_details', course_id: enrollmentId }),
            httpGet<IAnnouncementsResponse>(url, {
                section: 'get_announcements',
                course_id: enrollmentId,
            }),
            httpGet<IAssignmentsResponse>(url, {
                section: 'get_assignments',
                course_id: enrollmentId,
            }),
            httpGet<IModulesResponse>(url, { section: 'get_modules', course_id: enrollmentId }),
            httpGet<any>(url, { section: 'get_homepage_data', course_id: enrollmentId }),
            httpGet<IStudentDataResponse>(url, {
                section: 'get_students_course',
                course_id: enrollmentId,
            }),
            httpGet<IFileResponse>(url, {
                section: 'get_course_files',
                course_id: enrollmentId,
                teacher_uploaded: 'true',
            }),
        ])
            .then(([course, announce, assign, modulesRes, config, studentsRes, files]) => {
                setCourseDetails(course.data.data);
                setAnnouncements(announce.data.data);
                setAssignments(assign.data.data);
                setModules(modulesRes.data.data);
                setShowModuleWidget(config.data.data?.moduleWidgetConfig === 'true');
                setShowToDoWidget(config.data.data?.todoWidgetConfig === 'true');
                setBannerImage(config.data.data?.bannerImageConfig || null);
                setClassModule(config.data.data.classModuleName);
                setStudents(studentsRes.data.data);
                setCurrCourseId(course.data.data.id);
                setFiles(files.data.data);
                console.log('files for this course', files.data);
                console.log('homepage configs', config.data);
            })
            .catch(console.error);
    }, [enrollmentId]);

    const handleCreateAnnouncement = (title: string, content: string) => {
        const url = API_PREFIX + COURSE_ENDPOINT;
        const formData = { title, content, course_id: enrollmentId };
        const queryParams = { section: 'make_announcement' };

        const requestResponse = httpPost(url, formData, queryParams);
        requestResponse
            .then((res) => {
                console.log(res.data);
                setAnnouncements((prev) => [
                    ...prev,
                    { title, content }, // using the params directly
                ]);
            })
            .catch((err) => {
                console.log(err);
                console.log(enrollmentId);
            });
    };

    const enterEditMode = () => {
        console.log('homepage configs when entering edit mode.', showModuleWidget, showToDoWidget);
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
                    assignments={assignments}
                    classModule={classModule}
                    setClassModule={setClassModule}
                />
            ) : (
                <div className="view-course-page">
                    <div className="course-edit-btn">
                        {edit && (
                            <Button
                                displayName="Edit Page"
                                onClick={enterEditMode}
                                variant="primary"
                                icon="/edit.svg"
                            />
                        )}
                    </div>
                    <CourseHomePageUIController
                        permissions_all = {permissions}
                        courseDetails={courseDetails}
                        announcements={announcements}
                        assignments={assignments}
                        onPostAnnouncement={handleCreateAnnouncement}
                        bannerImage={bannerImage}
                        allModules={modules}
                        showToDoWidget={showToDoWidget}
                        showModuleWidget={showModuleWidget}
                        students={students}
                        setModules={setModules}
                        setShowModuleWidget={setShowModuleWidget}
                        setShowToDoWidget={setShowToDoWidget}
                        files={files}
                        setFiles={setFiles}
                        classModule={classModule}
                    />
                </div>
            )}
        </>
    );
}
