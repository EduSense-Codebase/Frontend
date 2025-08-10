import React from 'react';
import './CourseCodeCard.scss';

export interface ICourseCodeProps {
    code: string|undefined;
}

const CourseCode: React.FC<ICourseCodeProps> = ({ code }) => {
    return (
        <div className="code-container">
            <h3>Course Code</h3>
            <div className="code">{code}</div>
        </div>
    );
};

export default CourseCode;
