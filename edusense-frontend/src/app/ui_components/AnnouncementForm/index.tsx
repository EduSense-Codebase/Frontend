import React, { useState } from 'react';
import './AnnouncementForm.scss';
import Button from '../Button';
import { IAnnouncements, ICoursePermissions } from '@/app/typedef';
//import { error } from 'node:console';

interface AnnouncementFormProps {
    onSubmit: (title: string, message: string) => void;
    announcements: IAnnouncements[];
    perms: ICoursePermissions | undefined;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onSubmit, announcements, perms }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<IAnnouncements | null>(null);
    const allowed = perms?.create_annoucements;
    const [error, setError] = useState('');

    const handleCancel = () => {
        setTitle('');
        setMessage('');
    };

    const handleViewAnnouncement = (announcement: IAnnouncements) => {
        setSelectedAnnouncement(announcement);
    };

    const handleBackToForm = () => {
        setSelectedAnnouncement(null);
    };

    const handlePostAnnouncement = () => {
        if (title.trim() === '' || message.trim() === '') {
            setError('Error: Please input a title and description.');
            return;
        }
        onSubmit(title, message);
        setError('');
        setTitle('');
        setMessage('');
    };

    const recentAnnouncements = Array.isArray(announcements) ? announcements : [];

    return (
        <div className="announcements">
            {/* LEFT SIDE - Recent Announcements List */}
            <div
                data-testid="check-announcment"
                className={`announcements-left announcements-left--${perms?.create_annoucements}`}
            >
                <h3>Recent Announcements</h3>
                {recentAnnouncements.length === 0 ? (
                    <p className="no-announcements">No announcements yet.</p>
                ) : (
                    recentAnnouncements.map((announcement, index) => (
                        <div
                            key={index}
                            className="announcement-item"
                            data-testid={`announcment_appeared-${index}`}
                            onClick={() => handleViewAnnouncement(announcement)}
                        >
                            <h2>{announcement.title}</h2>
                            <p
                                data-testid={`announcement-body-${index}`}
                                className="announcement-message"
                            >
                                {announcement.content}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* RIGHT SIDE */}
            {allowed && (
                <div className="announcements-right">
                    <div className="announcement-inputs">
                        <label className="announcement-label">Create an announcement...</label>
                        <input
                            type="text"
                            className="announcement-title"
                            data-testid="announcement-title-fill"
                            placeholder="Title*"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            className="announcement-textarea"
                            data-testid="announcement-body-fill"
                            placeholder="Write a description..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        {error && <p className="error-message">{error}</p>}
                    </div>
                    <div className="announcement-actions">
                        <Button displayName="Cancel" variant="secondary" onClick={handleCancel} />
                        <Button
                            displayName="Post"
                            variant="primary"
                            id="announcement-post"
                            onClick={handlePostAnnouncement}
                        />
                    </div>
                </div>
            )}

            {/* Show selected announcement modal */}
            {selectedAnnouncement && (
                // If teacher clicked an announcement, show its details
                <div className="announcement-detail-view">
                    <div className="header">
                        <h2>{selectedAnnouncement.title}</h2>
                        <button onClick={handleBackToForm}>X</button>
                    </div>
                    <p>{selectedAnnouncement.content}</p>
                </div>
            )}

            {/* STUDENT VIEW */}
        </div>
    );
};

export default AnnouncementForm;
