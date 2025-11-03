import React, { useState } from 'react';
import './CourseHomePageUIController.scss';
import Tabs from '../../ui_components/Tabs';
import CourseCodeCard from '../../ui_components/CourseCodeCard';
import AnnouncementForm from '../../ui_components/AnnouncementForm';
import '../../style/theme.scss';
import {
    IAnnouncements,
    IAssignments,
    ICourse,
    ICoursePermissions,
    IFile,
    IStudentAssignments,
    IModules,
    IPermissions,
    IStudentData,
    IAssignmentCategories,
} from '@/app/typedef';
import ToDo from '@/app/ui_components/ToDo/ToDo';
import CurrentModule from '@/app/ui_components/CurrentModule/CurrentModule';
import ClassworkTab from '@/app/ui_components/ClassworkTab/ClassworkTab';
import GradesTab from '@/app/ui_components/GradesTab/GradesTab';
import SettingsTab from '@/app/ui_components/SettingsTab/SettingsTab';
interface Props {
    global_permissions?: IPermissions;
    course_permissions?: ICoursePermissions;
    sections: string[];
    // joinCourse?: boolean | undefined;
    // createCourse?: boolean | undefined;
    courseDetails?: ICourse | undefined;
    announcements: IAnnouncements[];
    assignments: IAssignments[];
    studentAssignments?: IStudentAssignments[] | undefined;
    assignmentCategories?: IAssignmentCategories[] | undefined;
    onPostAnnouncement: (title: string, message: string) => void;
    bannerImage?: string | null;
    allModules: IModules[];
    showToDoWidget: boolean;
    showModuleWidget: boolean;
    students: IStudentData[];
    files: IFile[];
    setFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
    setShowModuleWidget: React.Dispatch<React.SetStateAction<boolean>>;
    setShowToDoWidget: React.Dispatch<React.SetStateAction<boolean>>;
    setModules: React.Dispatch<React.SetStateAction<IModules[]>>;
    addSection: (newSection: string) => void;
    classModule: string;
}

const CourseHomePageUIController: React.FC<Props> = ({
    global_permissions,
    course_permissions,
    sections,
    courseDetails,
    announcements,
    assignments,
    studentAssignments,
    assignmentCategories,
    onPostAnnouncement,
    bannerImage,
    allModules,
    showToDoWidget,
    showModuleWidget,
    students,
    setModules,
    addSection,
    setShowModuleWidget,
    setShowToDoWidget,
    files,
    setFiles,
    classModule,
}) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const create_course = global_permissions?.create_course;
    const tabs = ['Overview', 'Classwork', 'Grades'];
    if (course_permissions?.create_grade_categories) tabs.push('Settings');

    // const edit = permissions_all?.edit;
    // const upload = permissions_all?.upload;
    // const create = permissions_all?.create;
    // const grade = permissions_all?.create;

    const gradesData = students;
    console.log('there should be assignments', gradesData);

    const onTabChange = (name: string) => {
        setActiveTab(name);
    };

    return (
        <div className="course-page">
            {/* Banner section */}
            <div
                className="course-header"
                style={{
                    backgroundImage: bannerImage ? `url(${bannerImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '2rem',
                    borderRadius: '8px',
                }}
            >
                <h1>{courseDetails?.course_name}</h1>
            </div>

            <div className="course-content">
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />

                {activeTab === 'Overview' && (
                    <div className="overview-content">
                        <div className="left-overview">
                            {create_course && <CourseCodeCard code={courseDetails?.join_code} />}

                            {/* Widgets Section */}
                            <div className="widgets-section">
                                {showToDoWidget && (
                                    <div className="widget-card">
                                        <ToDo
                                            editMode={false}
                                            assignments={assignments}
                                            setShowToDo={setShowToDoWidget}
                                        />
                                    </div>
                                )}
                                {showModuleWidget && allModules?.length > 0 && (
                                    <div className="widget-card">
                                        <CurrentModule
                                            moduleName={classModule}
                                            editMode={false}
                                            setModule={setShowModuleWidget}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Optional: List of all modules */}
                            {/* <ul className="module-list">
                                {allModules?.map((mod, idx) => (
                                    <li key={idx}>{mod.title}</li>
                                ))}
                            </ul> */}
                        </div>

                        <div className="right-overview">
                            <h3 className="announcements-title">Announcements</h3>
                            <AnnouncementForm
                                onSubmit={onPostAnnouncement}
                                announcements={announcements}
                                perms={course_permissions}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'Classwork' && (
                    <div>
                        <ClassworkTab
                            assignments={assignments}
                            modules={allModules.filter((item) => item.title !== 'no_module')}
                            setNewModules={setModules}
                            perms={course_permissions}
                            files={files}
                            setFiles={setFiles}
                        />
                    </div>
                )}

                {activeTab === 'Grades' && (
                    <div>
                        <GradesTab
                            grades={gradesData}
                            studentAssignments={studentAssignments}
                            assignmentCategories={assignmentCategories}
                            perms={course_permissions}
                        />
                    </div>
                )}

                {activeTab === 'Settings' && course_permissions?.create_grade_categories && (
                    <SettingsTab sections={sections} addSection={addSection} />
                )}
            </div>
        </div>
    );
};

export default CourseHomePageUIController;
