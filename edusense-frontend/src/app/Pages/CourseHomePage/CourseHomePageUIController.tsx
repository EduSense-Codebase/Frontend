import React from 'react';
import './CourseHomePageUIController.scss';
import Button from '../../ui_components/Button';
import Tabs from '../../ui_components/Tabs';
import CourseCodeCard from '../../ui_components/CourseCodeCard';
import AnnouncementForm from '../../ui_components/AnnouncementForm';
import '../../style/theme.scss';

interface Props {
  courseTitle: string;
  courseCode: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  announcements: any[];
  onCreate: () => void;
  onPostAnnouncement: (course:string, message: string) => void;
  onCancelAnnouncement: () => void;
  onEditPage: () => void;
}

const CourseHomePageUIController: React.FC<Props> = ({
  courseTitle,
  courseCode,
  activeTab,
  onTabChange,
  announcements,
  onCreate,
  onPostAnnouncement,
  onCancelAnnouncement,
  onEditPage
}) => {
  return (
    <div className="course-page">
      <h1 className="header">{courseTitle}</h1>
      <div className="edit-button-container">
        <Button displayName="Edit Course Page" onClick={onEditPage} variant="primary" icon="/edit.svg"/>
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
              <CourseCodeCard code={courseCode} />
              <Button displayName="Create" onClick={onCreate} variant="primary" icon="/plus.svg" />
            </div>
            <div className="right-overview">
              <h3 className="announcements-title">Announcements</h3>
              <AnnouncementForm onSubmit={onPostAnnouncement} courses={["SAT", "ACT"]} onCancel={onCancelAnnouncement}/>
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
