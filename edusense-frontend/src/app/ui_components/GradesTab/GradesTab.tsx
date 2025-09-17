'use client';
import React from 'react';
import './GradesTab.scss';
import { IAssignments, IStudentData } from '@/app/typedef';

interface GradesProps {
    grades: IStudentData[] | IAssignments[];
    create_course: boolean | undefined;
}

function getLetterGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}

export default function GradesTab({ grades, create_course }: GradesProps) {
    const emptyMessage = create_course
        ? 'No students enrolled in course yet'
        : 'No assignments graded yet';
    return (
        <div className="grades">
            <div className="header">
                <h2>Grades</h2>
            </div>

            <ul className="gradeList">
                {grades.length === 0 ? (
                    <p className="empty-array">{emptyMessage}</p>
                ) : (
                    (create_course
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
                                    {create_course
                                        ? item.overall_grade >= 0
                                            ? `${item.overall_grade}% (${getLetterGrade(item.overall_grade)})`
                                            : 'N/A'
                                        : item.graded >= 0
                                          ? `${item.graded}/${item.points}`
                                          : 'N/A'}
                                </span>
                            </li>
                        ))
                )}
            </ul>
        </div>
    );
}
