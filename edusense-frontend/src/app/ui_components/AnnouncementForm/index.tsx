import React, { useState } from 'react';
import './AnnouncementForm.scss';
import Button from '../Button';
import { IAnnouncements } from '@/app/typedef';

interface AnnouncementFormProps {
  onSubmit: (title: string, message: string) => void;
  announcements: IAnnouncements[];
  create_course: boolean | undefined;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  onSubmit,
  announcements,
  create_course,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<IAnnouncements | null>(null);

  const handleCancel = () => {
    setTitle('');
    setMessage('');
  };

  const handleViewAnnouncement = (announcement: IAnnouncements) => {
    setSelectedAnnouncement(announcement);
  };

  const closeAnnouncementView = () => {
    setSelectedAnnouncement(null);
  };

  const recentAnnouncements = Array.isArray(announcements) ? announcements.slice(0, 5) : [];

  return (
    <div className="announcements">
      <div className="announcements-left">
        <h3>Recent Announcements</h3>
        {recentAnnouncements.length === 0 ? (
          <p className="no-announcements">No announcements yet.</p>
        ) : (
          recentAnnouncements.map((announcement, index) => (
            <div
              key={index}
              className="announcement-item"
              onClick={() => handleViewAnnouncement(announcement)}
            >
              <h2>{announcement.title}</h2>
              <p className="announcement-message">{announcement.content}</p>
            </div>
          ))
        )}
      </div>

      {create_course ? (
        <div className="announcements-right">
          <div className="announcement-inputs">
            <label className="announcement-label">Create an announcement...</label>
            <input
              type="text"
              className="announcement-title"
              placeholder="Title*"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="announcement-textarea"
              placeholder="Write a description..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="announcement-actions">
            <Button displayName="Cancel" variant="secondary" onClick={handleCancel} />
            <Button
              displayName="Post"
              variant="primary"
              onClick={() => onSubmit(title, message)}
            />
          </div>
        </div>
      ) : (
        // Only show the most recent announcement in larger format
        recentAnnouncements.length > 0 && (
          <div
            className="single-announcement-view"
            onClick={() => handleViewAnnouncement(recentAnnouncements[0])}
          >
            <h2>{recentAnnouncements[0].title}</h2>
            <p>{recentAnnouncements[0].content}</p>
          </div>
        )
      )}

      {/* Modal / Larger View */}
      {selectedAnnouncement && (
        <div className="announcement-modal">
          <div className="announcement-modal-content">
            <h2>{selectedAnnouncement.title}</h2>
            <p>{selectedAnnouncement.content}</p>
            <Button displayName="Close" variant="secondary" onClick={closeAnnouncementView} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementForm;
