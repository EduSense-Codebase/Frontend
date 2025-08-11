'use client';
import React from 'react';
import './GradesTab.scss';

export interface Grade {
  id: number;
  label: string;  // e.g. "Midterm Exam", "Project 1"
  score: string;  // e.g. "85%", "A-", "92/100"
}

export interface GradesTabProps {
  grades: Grade[];
}

export default function GradesTab({ grades }: GradesTabProps) {
  return (
    <div className="grades">
      <div className="header">
        <h2>Grades</h2>
      </div>

      <ul className="gradeList">
        {grades.map(({ id, label, score }) => (
          <li key={id} className="gradeItem">
            <span className="gradeLabel">📋 {label}</span>
            <span className="gradeValue">{score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
