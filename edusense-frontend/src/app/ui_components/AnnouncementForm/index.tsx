import React, { useState } from 'react';
import './AnnouncementForm.scss';
import Button from '../Button';
import { IAnnouncements, IPermissions } from '@/app/typedef';

interface AnnouncementFormProps {
    onSubmit: (title: string, message: string) => void;
    announcements: IAnnouncements[];
    perms: IPermissions | undefined;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onSubmit, announcements, perms }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<IAnnouncements | null>(null);
    const allowed = perms?.create || perms?.edit || perms?.upload || perms?.grade;

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

    const recentAnnouncements = Array.isArray(announcements) ? announcements : [];

    return (
        <div className="announcements">
            {/* LEFT SIDE - Recent Announcements List */}
            <div className={`announcements-left announcements-left--${create_course}`}>
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

            {/* RIGHT SIDE */}
            {allowed && (
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
