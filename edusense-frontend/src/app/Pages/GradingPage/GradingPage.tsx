import React from 'react';
import './GradingPage.scss';
import Button from '@/app/ui_components/Button/index';

export type AssignmentStatus = "Submitted" | "Late" | "Not Submitted";

export interface StudentAssignment {
    id: number;
    name: string;
    status?: AssignmentStatus;
    pointsAwarded?: number;
}

interface GradingPageProps {
    title: string;
    assignments: StudentAssignment[];
    totalPoints: number;
    handleAutoGrade: () => void;
    gradeSubmission: (id: number) => void;
}

const GradingPage: React.FC<GradingPageProps> = ({
    title,
    assignments,
    totalPoints,
    handleAutoGrade,
    gradeSubmission,
}) => {

    const localGradeSubmission = (id: number, status?: AssignmentStatus) => {
        if (status !== "Not Submitted") {
            gradeSubmission(id);
        }
    }

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
                    {assignments.map((assignment) => {
                        const statusClass =
                            assignment.status === 'Submitted'
                                ? 'submitted'
                                : assignment.status === 'Late'
                                  ? 'late'
                                  : assignment.status === 'Not Submitted'
                                    ? 'not-submitted'
                                    : '';

                        const submissionCardClass = 
                            `submission-card ${assignment.status == "Not Submitted" 
                                ? "" 
                                : "cursor-pointer"
                            }`
                        return (
                            <div
                                key={assignment.id}
                                className={submissionCardClass}
                                onClick={() => localGradeSubmission(assignment.id, assignment.status)}
                            >
                                <h3>{assignment.name}</h3>
                                <p>{assignment.id}</p>
                                <p className={`status--${statusClass}`}>
                                    {assignment.status !== 'Not Submitted' && <p>● </p>}
                                    {assignment.status || 'Not Submitted'}
                                </p>
                                <p className="points">
                                    {assignment.pointsAwarded != undefined
                                        ? `${assignment.pointsAwarded}/${totalPoints}`
                                        : `__/${totalPoints}`}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="auto-grade-btn">
                <Button
                    displayName="Auto Grade"
                    onClick={handleAutoGrade}
                    icon="/grading-page/refresh.png"
                />
            </div>
        </div>
    );
};

export default GradingPage;
