'use client';
import React, { useState } from 'react';
import './ClassworkTab.scss';

interface Module {
  id: number;
  name: string;
  assignments: string[];
}

interface ClassworkProps {
  modules: Module[];
  unassignedAssignments: string[];
}

export default function ClassworkTab({
  modules,
  unassignedAssignments
}: ClassworkProps) {
  const [expandedModules, setExpandedModules] = useState<number[]>([]);

  const toggleModule = (id: number) => {
    setExpandedModules(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  return (
    <div className="classwork">
      <div className="header">
        <h2>Classwork</h2>
        <button className="createBtn">＋ Create</button>
      </div>

      {modules.map(module => (
        <div key={module.id} className="module">
          <div
            className="moduleHeader"
            onClick={() => toggleModule(module.id)}
          >
            <span>
              <span className="moduleIcon">📦</span>
              {module.name}
            </span>
            <span>
              {expandedModules.includes(module.id) ? '▲' : '▼'}
            </span>
          </div>

          {expandedModules.includes(module.id) && (
            <ul className="assignmentList">
              {module.assignments.map((assignment, idx) => (
                <li key={idx} className="assignmentItem">
                  📝 {assignment}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {unassignedAssignments.length > 0 && (
        <div className="module">
          <ul className="assignmentList">
            {unassignedAssignments.map((assignment, idx) => (
              <li key={idx} className="assignmentItem">
                📝 {assignment}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
