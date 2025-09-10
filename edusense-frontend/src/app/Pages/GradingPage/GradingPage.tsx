import React, { useRef, useState } from 'react';
import './GradingPage.scss';
import Image from 'next/image';
import Button from '@/app/ui_components/Button/index';

export interface StudentAssignment {
    id: number;
    name: string;
    status?: 'Submitted' | 'Late' | 'Not Submitted';
    pointsAwarded?: number | null;
}

interface GradingPageProps {
    title: string;
    assignments: StudentAssignment[];
    totalPoints: number;
    handleAutoGrade: () => void;
    gradeSubmission: () => void;
}

const GradingPage: React.FC<GradingPageProps> = ({
    title,
    assignments,
    totalPoints,
    handleAutoGrade,
    gradeSubmission,
}) => {
    
    return (
        <div className="grading-container">
            <h1>{title}</h1>
        <div className="submissions-container">
            <div className="submissions-header">
                <h3>Name</h3>
                <h3>ID</h3>
                <h3>Status</h3>
                <h3>Points</h3>
            </div>
                <div className="submissions-list">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="submission-card" onClick={gradeSubmission}>
                            <h3>{assignment.name}</h3>
                            <p>{assignment.id}</p>
                            <p>{assignment.status || 'Not Submitted'}</p>
                            <p className='points'>{assignment.pointsAwarded !== null ? `${assignment.pointsAwarded}/${totalPoints}` : `__/${totalPoints}`}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className='auto-grade-btn'>
                <Button displayName="Auto Grade" onClick={handleAutoGrade} icon='/grading-page/refresh.png' />
            </div>
        </div>
    );
};

export default GradingPage;
