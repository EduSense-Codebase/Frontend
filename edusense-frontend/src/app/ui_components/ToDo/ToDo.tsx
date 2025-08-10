import React from "react";
import './ToDo.scss';
import { ICourse } from "@/app/typedef";

const mockAssignments = [
  "Math Homework: Algebra",
  "History Essay Draft",
  "Science Project Proposal",
];

export default function ToDo({courses}: {courses:ICourse}) {
  return (
    <div className="todo-container">
      <h3 className="todo-title">Upcoming Assignments</h3>
      {mockAssignments.map((assignment, idx) => (
        <div key={idx} className="todo-item">
          {assignment}
        </div>
      ))}
    </div>
  );
}
