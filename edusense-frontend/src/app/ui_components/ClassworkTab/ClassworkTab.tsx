'use client';
import React, { useState } from 'react';
import './ClassworkTab.scss';
import { IModules, IAssignments, IModuleResponse } from '@/app/typedef';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { API_PREFIX, COURSE_ENDPOINT } from '@/app/global';
import { httpPost } from '@/app/utils';

interface ClassworkProps {
  modules: IModules[];
  assignments: IAssignments[];

  setNewModules: React.Dispatch<React.SetStateAction<IModules[]>>;
}

export default function ClassworkTab({ modules, assignments, setNewModules }: ClassworkProps) {
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const { enrollmentId } = useParams();

  const toggleModule = (id: number) => {
    setExpandedModules(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleCreateSelect = (type: 'assignment' | 'module') => {
    setShowCreateMenu(false);
    if (type === 'module') {
      setShowModuleModal(true);
    } else {
      console.log('Create assignment clicked');
      // open assignment modal / navigate here later
    }
  };

  const assignmentsByModule: Record<number, IAssignments[]> = {};
  modules.forEach(mod => {
    assignmentsByModule[mod.id] = assignments.filter(a => a.module === mod.id);
  });

  const unassignedAssignments = assignments.filter(
    a => !a.module || a.module === 0 || !modules.some(m => m.id === a.module)
  );

  const renderCreateDropdown = () => (
    <div className="createDropdown">
      <button
        className="dropdownItem"
        onClick={() => handleCreateSelect('assignment')}
      >
        📝 Assignment
      </button>
      <button
        className="dropdownItem"
        onClick={() => handleCreateSelect('module')}
      >
        📦 Module
      </button>
    </div>
  );

  const createModuleCallback = () => {
    const url = API_PREFIX + COURSE_ENDPOINT
    const formData = {course: enrollmentId, title: moduleTitle}
    const queryParams = {"section": "make_module"}

    const requestResponse = httpPost<IModuleResponse>(url, formData, queryParams);
    requestResponse.then((res) =>{
        console.log("created module",res.data)
        const newModule = res.data.data; // your new module object from the backend
        setNewModules((prevModules) => [...prevModules, newModule]);
    })

    setShowModuleModal(false)

  }

  const renderModuleModal = () => (
    <div className="modalOverlay">
      <div className="modalContent">
        <h3>Create New Module</h3>
        <input
          type="text"
          value={moduleTitle}
          onChange={e => setModuleTitle(e.target.value)}
          placeholder="Enter module title..."
          className="modalInput"
        />
        <div className="modalActions">
          <button className="modalBtn submit" onClick={createModuleCallback}>
            Create
          </button>
          <button
            className="modalBtn cancel"
            onClick={() => setShowModuleModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="classwork">
      <div className="header">
        <h2>Classwork</h2>
        <div className="createContainer">
          <button
            className="createBtn"
            onClick={() => setShowCreateMenu(prev => !prev)}
          >
            ＋ Create
          </button>
          {showCreateMenu && renderCreateDropdown()}
        </div>
      </div>

      {modules.map(module => (
        <div key={module.id} className="module">
          <div className="moduleHeader" onClick={() => toggleModule(module.id)}>
            <span>
              <span className="moduleIcon">📦</span> {module.title}
            </span>
            <span>{expandedModules.includes(module.id) ? '▲' : '▼'}</span>
          </div>

          {expandedModules.includes(module.id) && (
            <ul className="assignmentList">
              {assignmentsByModule[module.id].map(assignment => (
                <li key={assignment.id} className="assignmentItem">
                  <Link
                    href={`/portal/builder/${enrollmentId}/${assignment.builder}`}
                  >
                    📝 {assignment.name}
                  </Link>
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
                <Link
                  href={`/portal/builder/${enrollmentId}/${assignment.builder}`}
                >
                  📝 {assignment.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showModuleModal && renderModuleModal()}
    </div>
  );
}
