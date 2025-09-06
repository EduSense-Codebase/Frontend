import React, { useState } from 'react';
// import './CourseHomePageUIController.scss';
// import '../../style/theme.scss';

import Tabs from '../../ui_components/Tabs';
import CourseCodeCard from '../../ui_components/CourseCodeCard';
import AnnouncementForm from '../../ui_components/AnnouncementForm';

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
        <div className="min-h-screen">
            {/* Banner */}
            <div className="relative mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <div
                    className="relative flex min-h-[160px] items-end overflow-hidden rounded-2xl bg-neutral-200 bg-cover bg-center md:min-h-[220px] dark:bg-neutral-800"
                    style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : undefined}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <h1 className="relative z-10 truncate px-4 py-4 text-2xl font-bold text-white drop-shadow sm:px-6 sm:text-3xl md:px-8">
                        {courseDetails?.course_name}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <Tabs
                    tabs={['Overview', 'Classwork', 'Grades']}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                />

                {activeTab === 'Overview' && (
                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr] lg:gap-6">
                        <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:p-6 dark:border-neutral-800 dark:bg-neutral-900">
                            {createCourse && (
                                <div className="mb-4">
                                    <CourseCodeCard code={courseDetails?.join_code} />
                                </div>
                            )}

                            <h3 className="mb-3 text-base font-semibold">Announcements</h3>
                            <AnnouncementForm
                                onSubmit={onPostAnnouncement}
                                announcements={announcements}
                                create_course={createCourse}
                            />
                        </section>

                        {/* Right: widgets stack */}
                        <section className="grid grid-cols-1 gap-4">
                            {showToDoWidget && (
                                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:p-6 dark:border-neutral-800 dark:bg-neutral-900">
                                    <ToDo
                                        editMode={false}
                                        assignments={assignments}
                                        setShowToDo={setShowToDoWidget}
                                    />
                                </div>
                            )}

                            {showModuleWidget && allModules?.length > 0 && (
                                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:p-6 dark:border-neutral-800 dark:bg-neutral-900">
                                    <CurrentModule
                                        moduleName={classModule}
                                        editMode={false}
                                        setModule={setShowModuleWidget}
                                    />
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {activeTab === 'Classwork' && (
                    <div className="mt-4">
                        <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:p-6 dark:border-neutral-800 dark:bg-neutral-900">
                            <ClassworkTab
                                assignments={assignments}
                                modules={allModules.filter((item) => item.title !== 'no_module')}
                                setNewModules={setModules}
                                join_course={joinCourse}
                                files={files}
                                setFiles={setFiles}
                            />
                        </section>
                    </div>
                )}

                {activeTab === 'Grades' && (
                    <div className="mt-4">
                        <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:p-6 dark:border-neutral-800 dark:bg-neutral-900">
                            <GradesTab grades={gradesData} create_course={createCourse} />
                        </section>
                    </div>
                )}

                {/* Mobile safe-area padding (useful if there is a bottom bar) */}
                <div className="pb-20 md:pb-0" />
            </div>
        </div>
    );
};

export default CourseHomePageUIController;
