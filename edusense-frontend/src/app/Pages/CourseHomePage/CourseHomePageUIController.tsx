import React, { useState } from 'react';
import './CourseHomePageUIController.scss';
import Button from '../../ui_components/Button';
import Tabs from '../../ui_components/Tabs';
import CourseCodeCard from '../../ui_components/CourseCodeCard';
import AnnouncementForm from '../../ui_components/AnnouncementForm';
import '../../style/theme.scss';
import { IAnnouncements, IAssignments, ICourse } from '@/app/typedef';

interface Props {
    joinCourse: boolean | undefined;
    createCourse: boolean | undefined;
    courseDetails: ICourse | undefined;
    //activeTab: string;
    //onTabChange: (tab: string) => void;
    announcements: IAnnouncements[];
    assignments: IAssignments[]
    //onCreate: () => void;
    onPostAnnouncement: (title:string, message: string) => void;
    //onEditPage: () => void;
}

const CourseHomePageUIController: React.FC<Props> = ({
    joinCourse,
    createCourse,

    courseDetails,
    //activeTab,
    //onTabChange,
    announcements,
    assignments,
    //onCreate,
    onPostAnnouncement,
    //onEditPage,
}) => {

    const [activeTab, setActiveTab] = useState('Overview')
    const onTabChange = (name:string) => {

        setActiveTab(name)
    }

  return (
    <div className="course-page">
      <h1 className="course-header">{courseDetails?.course_name}</h1>
      {/* <div className="edit-button-container">
        <Button displayName="Edit Course Page" onClick={onEditPage} variant="primary" icon="/edit.svg"/>
      </div> */}
      
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
              <Button displayName="Create" onClick={(() => (console.log("clicked")))} variant="primary" icon="/plus.svg" />
            </div>
            <div className="right-overview">
              <h3 className="announcements-title">Announcements</h3>
              <AnnouncementForm onSubmit={onPostAnnouncement} announcements={announcements}/>
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
