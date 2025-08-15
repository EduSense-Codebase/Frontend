import React from 'react';
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

    onUploadClick: () => void;

    onPublishClick: () => void;
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
    onUploadClick,
    onPublishClick,
}) => {
    return (
        <div className="container">
            <div className="header">
                <Image src={'/publish_page/publish.png'} width={50} height={50} alt="file icon" />
                <h2>New Assignment</h2>
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
                                onClick={onUploadClick}
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
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="right">
                    <label>
                        Course
                        <select value={course} onChange={onCourseChange}>
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
                        <input type="date" value={due} onChange={onDueChange} />
                    </label>

                    <label>
                        Module
                        <select value={module} onChange={onModuleChange}>
                            <option value="">Choose Module</option>
                            {/* Add more options dynamically in parent */}
                        </select>
                    </label>
                </div>
            </div>

            <Button displayName="Publish" variant="primary" onClick={onPublishClick} />
        </div>
    );
};

export default PublishPage;
