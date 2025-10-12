'use client';
import React from 'react';
import './GradesTab.scss';
import { IAssignments, ICoursePermissions, IStudentData } from '@/app/typedef';

interface GradesProps {
    grades: IStudentData[] | IAssignments[];
    perms: ICoursePermissions | undefined;
}

function getLetterGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}

export default function GradesTab({ grades, perms }: GradesProps) {
    const non_student = perms?.view_all_students;
    const emptyMessage = non_student
        ? 'No students enrolled in course yet'
        : 'No assignments graded yet';
    console.log('students', grades);
    return (
        <div className="grades">
            <div className="header">
                <h2>Grades</h2>
            </div>

            <ul className="gradeList">
                {grades.length === 0 ? (
                    <p className="empty-array">{emptyMessage}</p>
                ) : (
                    (non_student
                        ? grades // Teacher view → show all student data
                        : grades.filter(
                              (item: IAssignments) =>
                                  item.assignment_data?.type === 'quiz_or_assignment',
                          )
                    ) // Student view → filter assignments
                        .map((item: any) => (
                            <li key={item.email || item.id} className="gradeItem">
                                <span className="gradeLabel">📋 {item.name}</span>

                                <span className="gradeValue">
                                    {non_student
                                        ? item.overall_grade >= 0
                                            ? `${item.overall_grade}% (${getLetterGrade(item.overall_grade)})`
                                            : 'N/A'
                                        : item.assignment_data?.is_published
                                          ? `${item.assignment_data?.submission.user_id.ai_grade}`
                                          : 'N/A'}
                                </span>
                            </li>
                        ))
                )}
            </ul>
        </div>
    );
}
