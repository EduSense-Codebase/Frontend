'use client';
import React from 'react';
import './GradesTab.scss';
import {
    IAssignmentCategories,
    ICoursePermissions,
    IStudentAssignments,
    IStudentData,
} from '@/app/typedef';

interface GradesProps {
    grades: IStudentData[];
    studentAssignments?: IStudentAssignments[] | undefined;
    assignmentCategories?: IAssignmentCategories[];
    perms: ICoursePermissions | undefined;
}

function getLetterGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}

export default function GradesTab({
    grades,
    studentAssignments,
    assignmentCategories,
    perms,
}: GradesProps) {
    const emptyMessage = perms?.view_all_students
        ? 'No students enrolled in course yet'
        : 'No assignments graded yet';

    const renderStudentAssignments = () => {
        if (!studentAssignments || studentAssignments.length === 0) {
            return <p className="empty-array">{emptyMessage}</p>;
        }
        return studentAssignments!.map((assignment: IStudentAssignments, index) => (
            <li key={`grades-items-${index}`} className="gradeItem">
                <span className="gradeLabel">📋 {assignment.name}</span>
                <span className="gradeCategory">Category: {assignment.category}</span>
                <span className="gradeValue">
                    {assignment.earned_points >= 0
                        ? `${assignment.earned_points} / ${assignment.total_points}`
                        : `- / ${assignment.total_points}`}
                </span>
            </li>
        ));
    };

    const renderStudents = () => {
        if (grades.length === 0) {
            return <p className="empty-array">{emptyMessage}</p>;
        }
        return grades.map((item: any, index) => (
            <li key={`grades-items-${index}`} className="gradeItem">
                <span className="gradeLabel">📋 {item.name}</span>
                <span className="gradeValue">
                    {item.overall_grade >= 0
                        ? `${item.overall_grade}% (${getLetterGrade(item.overall_grade)})`
                        : 'N/A'}
                </span>
            </li>
        ));
    };

    const renderStudentsOrStudentAssignments = () => {
        if (studentAssignments == undefined) {
            return renderStudents();
        }
        return renderStudentAssignments();
    };

    return (
        <div className="gradesPage">
            <div className="grades">
                <div className="header">
                    <h2>Grades</h2>
                </div>

                <ul className="gradeList">{renderStudentsOrStudentAssignments()}</ul>
            </div>
            {assignmentCategories != undefined && (
                <div className="categories">
                    <h2 className="categoriesHeader">Categories</h2>
                    <table className="categoriesTable">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignmentCategories.map((cat, index) => (
                                <tr key={`cat-${index}`}>
                                    <td>{cat.name}</td>
                                    <td>{cat.weight}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
