import React from "react";
import './ToDo.scss';
import { IAssignments, ICourse } from "@/app/typedef";

const mockAssignments = [
  "Math Homework: Algebra",
  "History Essay Draft",
  "Science Project Proposal",
];

export default function ToDo({
    course,
    assignments
  }: {
    course: ICourse | undefined;
    assignments: IAssignments[];
  }) {
  return (
    <div className="todo-container">
      <h3 className="todo-title">Upcoming Assignments</h3>
      {assignments.map((assignment, idx) => (
        <div key={idx} className="todo-item">
          {assignment.name}
        </div>
      ))}
    </div>
  );
}
