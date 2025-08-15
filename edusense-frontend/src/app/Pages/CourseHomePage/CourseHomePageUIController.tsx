import React, { useState } from 'react';
import './CourseHomePageUIController.scss';
import Button from '../../ui_components/Button';
import Tabs from '../../ui_components/Tabs';
import CourseCodeCard from '../../ui_components/CourseCodeCard';
import AnnouncementForm from '../../ui_components/AnnouncementForm';
import '../../style/theme.scss';
import { IAnnouncements, IAssignments, ICourse, IModules, IStudentData } from '@/app/typedef';
import ToDo from '@/app/ui_components/ToDo/ToDo';
import CurrentModule from '@/app/ui_components/CurrentModule/CurrentModule';
import ClassworkTab from '@/app/ui_components/ClassworkTab/ClassworkTab';
import GradesTab from '@/app/ui_components/GradesTab/GradesTab';
import { create } from 'domain';

interface Props {
    joinCourse: boolean | undefined;
    createCourse: boolean | undefined;
    courseDetails: ICourse | undefined;
    announcements: IAnnouncements[];
    assignments: IAssignments[];
    onPostAnnouncement: (title: string, message: string) => void;
    bannerImage: string | null;
    allModules: IModules[];
    showToDoWidget: boolean;
    showModuleWidget: boolean;
    students: IStudentData[];

    setModules: React.Dispatch<React.SetStateAction<IModules[]>>;
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
                    tabs={['Overview', 'Classwork', 'Grades']}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                />

                {activeTab === 'Overview' && (
                    <div className="overview-content">
                        <div className="left-overview">
                            {createCourse && <CourseCodeCard code={courseDetails?.join_code} />}
                            {/* <Button
                                displayName="Create"
                                onClick={() => console.log("clicked")}
                                variant="primary"
                                icon="/plus.svg"
                            /> */}

                            {/* Widgets Section */}
                            <div className="widgets-section">
                                {showToDoWidget && (
                                    <div className="widget-card">
                                        <ToDo course={courseDetails} assignments={assignments} />
                                    </div>
                                )}
                                {showModuleWidget && allModules?.length > 0 && (
                                    <div className="widget-card">
                                        <CurrentModule moduleName={allModules[0].title} />
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
                        />
                    </div>
                )}

                {activeTab === 'Grades' && (
                    <div>
                        <GradesTab grades={gradesData} create_course={createCourse} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseHomePageUIController;
