import React, { useState } from 'react';
import './AnnouncementForm.scss';
import Button from '../Button';

interface AnnouncementFormProps {
  courses: string[];
  onSubmit: (course: string, message: string) => void;
  onCancel: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  courses,
  onSubmit,
  onCancel
}) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [message, setMessage] = useState('');

  const handlePost = () => {
    if (!selectedCourse || !message.trim()) return;
    onSubmit(selectedCourse, message.trim());
    setMessage('');
    setSelectedCourse('');
  };

  return (
    <div className="announcement-form">
      <label className="announcement-label">Create an announcement for...</label>
      
      <div className="announcement-inputs">
        <select
            className="announcement-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
        >
            <option value="" disabled>Choose Course</option>
            {courses.map((course) => (
            <option key={course} value={course}>{course}</option>
            ))}
        </select>

        <textarea
            className="announcement-textarea"
            placeholder="Write an announcement..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      
      <div className="announcement-actions">
        <Button displayName="Cancel" variant="secondary" onClick={onCancel} />
        <Button displayName="Post" variant="primary" onClick={handlePost} />
      </div>
    </div>
  );
};

export default AnnouncementForm;
