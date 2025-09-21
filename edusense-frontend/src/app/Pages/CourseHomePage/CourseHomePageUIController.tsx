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
    IFile,
    IModules,
    IStudentData,
} from '@/app/typedef';
import ToDo from '@/app/ui_components/ToDo/ToDo';
import CurrentModule from '@/app/ui_components/CurrentModule/CurrentModule';
import ClassworkTab from '@/app/ui_components/ClassworkTab/ClassworkTab';
import GradesTab from '@/app/ui_components/GradesTab/GradesTab';
import SettingsTab from '@/app/ui_components/SettingsTab/SettingsTab';
interface Props {
    joinCourse?: boolean | undefined;
    createCourse?: boolean | undefined;
    courseDetails?: ICourse | undefined;
    announcements: IAnnouncements[];
    assignments: IAssignments[];
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
    classModule: string;
}

const CourseHomePageUIController: React.FC<Props> = ({
    joinCourse,
    createCourse,
    courseDetails,
    announcements,
    assignments,
    onPostAnnouncement,
    bannerImage,
    allModules,
    showToDoWidget,
    showModuleWidget,
    students,
    setModules,
    setShowModuleWidget,
    setShowToDoWidget,
    files,
    setFiles,
    classModule,
}) => {
    const [activeTab, setActiveTab] = useState('Overview');

    const gradesData = createCourse ? students : assignments;

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
                <Tabs
                    tabs={['Overview', 'Classwork', 'Grades', 'Settings']}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                />

                {activeTab === 'Overview' && (
                    <div className="overview-content">
                        <div className="left-overview">
                            {createCourse && <CourseCodeCard code={courseDetails?.join_code} />}

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
                                create_course={createCourse}
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
                            join_course={joinCourse}
                            files={files}
                            setFiles={setFiles}
                        />
                    </div>
                )}

                {activeTab === 'Grades' && (
                    <div>
                        <GradesTab grades={gradesData} create_course={createCourse} />
                    </div>
                )}

                {activeTab === 'Settings' && <SettingsTab />}
            </div>
        </div>
    );
};

export default CourseHomePageUIController;
