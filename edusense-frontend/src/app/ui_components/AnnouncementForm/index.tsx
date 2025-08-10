import React, { useState } from 'react';
import './AnnouncementForm.scss';
import Button from '../Button';
import { IAnnouncements } from '@/app/typedef';

interface AnnouncementFormProps {
  onSubmit: (title: string, message: string) => void;
  announcements: IAnnouncements[]
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  onSubmit,

  announcements,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  //const [announcements, setAnnouncements] = useState<{ title: string, message: string }[]>([]);

//   const handlePost = () => {
//     const trimmedTitle = title.trim();
//     const trimmedMessage = message.trim(); 
//     if (!trimmedTitle) return;

//     onSubmit(trimmedTitle, trimmedMessage);
//     setMessage('');
//     setTitle('');
//     setAnnouncements((prev) => [{ title: trimmedTitle, message: trimmedMessage }, ...prev]);

//   };

  const handleCancel = () => {
    setTitle('')
    setMessage('')
  }

  return (
    <div className="announcements">      
      <div className="announcements-left">
        <h3>Recent Announcements</h3>
        <div className="recent-announcements">
          {announcements.length === 0 ? (
            <p className="no-announcements">No announcements yet.</p>
          ) : (
            announcements.slice(0, 5).map((announcement, index) => (
              <div key={index} className="announcement-item">
                <h2>{announcement.title}</h2>
                <p className="announcement-message">{announcement.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className='announcements-right'>
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
          <Button displayName="Post" variant="primary" onClick={(() => (onSubmit(title, message)))} />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementForm;
