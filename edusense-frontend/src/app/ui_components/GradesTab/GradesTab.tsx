'use client';
import React from 'react';
import './GradesTab.scss';
import { IStudentData } from '@/app/typedef';

function getLetterGrade(score: number): string {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
}

export default function GradesTab({ grades }: { grades: IStudentData[] }) {
        return (
        <div className="grades">
            <div className="header">
            <h2>Grades</h2>
            </div>
    
            <ul className="gradeList">
            {grades.map((item) => (
                <li key={item.email} className="gradeItem">
                <span className="gradeLabel">📋 {item.name}</span>
                <span className="gradeValue">
                    {item.overall_grade >= 0
                    ? `${item.overall_grade}% (${getLetterGrade(item.overall_grade)})`
                    : "N/A"}
                </span>
                </li>
            ))}
            </ul>
        </div>
        );
}