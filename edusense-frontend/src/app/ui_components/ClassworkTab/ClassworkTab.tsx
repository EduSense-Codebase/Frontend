'use client';
import React, { useState } from 'react';
import './ClassworkTab.scss';
import { IModules, IAssignments } from '@/app/typedef';

interface ClassworkProps {
  modules: IModules[];
  assignments: IAssignments[];
}

export default function ClassworkTab({
  modules,
  assignments
}: ClassworkProps) {
  const [expandedModules, setExpandedModules] = useState<number[]>([]);

  const toggleModule = (id: number) => {
    setExpandedModules(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  // Assignments grouped by module
  const assignmentsByModule: Record<number, IAssignments[]> = {};

  modules.forEach((mod) => {
    assignmentsByModule[mod.id] = assignments.filter(a => a.module === mod.id);
  });

  // Assignments without a module (module === 0 or null or undefined)
  const unassignedAssignments = assignments.filter(
    a => !a.module || a.module === 0 || !modules.some(m => m.id === a.module)
  );

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
              <span className="moduleIcon">📦</span> {module.title}
            </span>
            <span>{expandedModules.includes(module.id) ? '▲' : '▼'}</span>
          </div>

          {expandedModules.includes(module.id) && (
            <ul className="assignmentList">
              {assignmentsByModule[module.id].map(assignment => (
                <li key={assignment.id} className="assignmentItem">
                  📝 {assignment.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {unassignedAssignments.length > 0 && (
        <div className="module unassigned">
          <ul className="assignmentList">
            {unassignedAssignments.map(assignment => (
              <li key={assignment.id} className="assignmentItem">
                📝 {assignment.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
