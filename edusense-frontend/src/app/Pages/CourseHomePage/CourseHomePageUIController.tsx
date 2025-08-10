import React, { useState } from 'react';
import './CourseHomePageUIController.scss';
import Button from '../../ui_components/Button';
import Tabs from '../../ui_components/Tabs';
import CourseCodeCard from '../../ui_components/CourseCodeCard';
import AnnouncementForm from '../../ui_components/AnnouncementForm';
import '../../style/theme.scss';
import { IAnnouncements, IAssignments, ICourse, IModules } from '@/app/typedef';
import ToDo from '@/app/ui_components/ToDo/ToDo';
import CurrentModule from '@/app/ui_components/CurrentModule/CurrentModule';

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
}) => {
    const [activeTab, setActiveTab] = useState('Overview');

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
                            <CourseCodeCard code={courseDetails?.join_code} />
                            <Button
                                displayName="Create"
                                onClick={() => console.log("clicked")}
                                variant="primary"
                                icon="/plus.svg"
                            />

                            {/* Widgets Section */}
                            <div className="widgets-section">
                                {showToDoWidget && (
                                    <div className="widget-card">
                                        <ToDo course={courseDetails} />
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
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'Classwork' && (
                    <div>
                        <h2>Classwork</h2>
                    </div>
                )}

                {activeTab === 'Grades' && (
                    <div>
                        <h2>Grades</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseHomePageUIController;
