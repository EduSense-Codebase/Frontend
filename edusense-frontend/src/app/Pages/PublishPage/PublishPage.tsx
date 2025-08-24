import React, { useRef, useState } from 'react';
import './PublishPage.scss';
import Image from 'next/image';
import Button from '@/app/ui_components/Button/index';

interface PublishPageProps {
    title: string;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    instructions: string;
    onInstructionsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

    course: string;
    onCourseChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

    points: string;
    onPointsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    due: string;
    onDueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    module: string;
    onModuleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

    onPublishClick: () => void;

    onCloseClick: () => void;
}

const PublishPage: React.FC<PublishPageProps> = ({
    title,
    onTitleChange,
    instructions,
    onInstructionsChange,
    course,
    onCourseChange,
    points,
    onPointsChange,
    due,
    onDueChange,
    module,
    onModuleChange,
    onPublishClick,
    onCloseClick,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string>('No file chosen');

    return (
        <div className="publish-container">
            <div className="header">
                <div className="header-left">
                    <Image
                        src={'/publish_page/publish.png'}
                        width={50}
                        height={50}
                        alt="file icon"
                    />
                    <h2>New Assignment</h2>
                </div>
                <button onClick={onCloseClick}>X</button>
            </div>

            <div className="form">
                {/* Left Section */}
                <div className="left">
                    <label>
                        Title
                        <input
                            type="text"
                            placeholder="Title*"
                            value={title}
                            onChange={onTitleChange}
                        />
                    </label>

                    <label>
                        Instructions
                        <textarea
                            placeholder="Instructions (optional)"
                            value={instructions}
                            onChange={onInstructionsChange}
                        />
                    </label>

                    <div className="attach">
                        <span>Attach (optional)</span>
                        <div className="attach-buttons">
                            <button
                                className="upload"
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Image
                                    className="align-items"
                                    src="/publish_page/upload.png"
                                    width={60}
                                    height={60}
                                    alt="upload"
                                />
                                <p>Upload</p>
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setSelectedFileName(e.target.files[0].name);
                                        } else {
                                            setSelectedFileName('No file chosen');
                                        }
                                    }}
                                />
                                <span className="file-name-display">{selectedFileName}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="right">
                    <label>
                        Course
                        <select
                            value={course}
                            onChange={onCourseChange}
                            className={course === '' ? 'placeholder' : 'selected'}
                        >
                            <option value="">Choose Course</option>
                            {/* Add more options dynamically in parent */}
                        </select>
                    </label>

                    <label>
                        Points
                        <input
                            type="text"
                            placeholder="Enter points"
                            value={points}
                            onChange={onPointsChange}
                        />
                    </label>

                    <label>
                        Due
                        <input
                            type="date"
                            value={due}
                            onChange={onDueChange}
                            className={due === '' ? 'placeholder' : 'selected'}
                        />
                    </label>

                    <label>
                        Module
                        <select
                            value={module}
                            onChange={onModuleChange}
                            className={due === '' ? 'placeholder' : 'selected'}
                        >
                            <option value="">Choose Module</option>
                            {/* Add more options dynamically in parent */}
                        </select>
                    </label>
                    <div className="publish-btn">
                        <Button displayName="Publish" variant="primary" onClick={onPublishClick} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublishPage;
