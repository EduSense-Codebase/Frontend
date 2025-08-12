'use client';
import React from 'react';
import './GradesTab.scss';


export default function GradesTab({ grades} : {grades:string[]}) {
  return (
    <div className="grades">
      <div className="header">
        <h2>Grades</h2>
      </div>

      <ul className="gradeList">
        {grades.map((item:string) => (
          <li className="gradeItem">
            <span className="gradeLabel">📋 {item}</span>
            <span className="gradeValue">{"N/A"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
