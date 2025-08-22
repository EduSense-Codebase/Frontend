'use client';
import React, { useState } from 'react';
import './ClassworkTab.scss';
import { IModules, IAssignments, IModuleResponse, IFile, IOneFileResponse } from '@/app/typedef';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { API_PREFIX, COURSE_ENDPOINT } from '@/app/global';
import { httpPost } from '@/app/utils';
import Button from '../Button';

interface ClassworkProps {
    join_course: boolean | undefined;
    modules: IModules[];
    assignments: IAssignments[];

    setNewModules: React.Dispatch<React.SetStateAction<IModules[]>>;
    files: IFile[];
    setFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
}

export default function ClassworkTab({
    modules,
    assignments,
    setNewModules,
    join_course,
    files,
    setFiles,
}: ClassworkProps) {
    const [expandedModules, setExpandedModules] = useState<number[]>([]);
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showFileModal, setShowFileModal] = useState(false);
    const [moduleTitle, setModuleTitle] = useState('');
    const [fileDesc, setFileDesc] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isFilesSectionOpen, setIsFilesSectionOpen] = useState(false);

    const { enrollmentId } = useParams();
    const toggleModule = (id: number) => {
        setExpandedModules((prev) =>
            prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id],
        );
    };

    const handleCreateSelect = (type: 'assignment' | 'module' | 'file' | 'text-content') => {
        setShowCreateMenu(false);
        if (type === 'module') {
            setShowModuleModal(true);
        } else if (type === 'file') {
            setShowFileModal(true);
        } else if (type == 'assignment') {
            //redirect to builder page with assignment context
        } else {
            //redirect to builder page with text-content context
        }
    };

    const assignmentsByModule: Record<number, IAssignments[]> = {};
    modules.forEach((mod) => {
        assignmentsByModule[mod.id] = assignments.filter((a) => a.module === mod.id);
    });

    const unassignedAssignments = assignments.filter(
        (a) => !a.module || a.module === 0 || !modules.some((m) => m.id === a.module),
    );

    const renderCreateDropdown = () => (
        <div className="createDropdown">
            <button className="dropdownItem" onClick={() => handleCreateSelect('assignment')}>
                📝 Assignment
            </button>
            <button className="dropdownItem" onClick={() => handleCreateSelect('text-content')}>
                Text-based Content
            </button>
            <button className="dropdownItem" onClick={() => handleCreateSelect('module')}>
                📦 Module
            </button>
            <button className="dropdownItem" onClick={() => handleCreateSelect('file')}>
                📄 File
            </button>
        </div>
    );

    const createModuleCallback = () => {
        const url = API_PREFIX + COURSE_ENDPOINT;
        const formData = { course: enrollmentId, title: moduleTitle };
        const queryParams = { section: 'make_module' };

        const requestResponse = httpPost<IModuleResponse>(url, formData, queryParams);
        requestResponse.then((res) => {
            console.log('created module', res.data);
            const newModule = res.data.data;
            setNewModules((prevModules) => [...prevModules, newModule]);
        });

        setShowModuleModal(false);
    };

    const uploadFileCallback = async () => {
        //make api request here

        const url = API_PREFIX + COURSE_ENDPOINT;
        const formData = { file: selectedFile, course_id: enrollmentId, desc: fileDesc };
        const queryParams = { section: 'upload_file' };

        const requestResponse = httpPost<IOneFileResponse>(url, formData, queryParams);
        requestResponse.then((res) => {
            console.log('uploaded file', res.data);
            const newFile = res.data.data;
            setFiles((prevFiles) => [...prevFiles, newFile]);
        });

        setShowFileModal(false);
    };

    const renderModuleModal = () => (
        <div className="modalOverlay">
            <div className="modalContent">
                <h3>Create New Module</h3>
                <input
                    type="text"
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                    placeholder="Enter module title..."
                    className="modalInput"
                />
                <div className="modalActions">
                    <Button displayName="Create" variant="primary" onClick={createModuleCallback} />
                    <Button
                        displayName="Cancel"
                        variant="secondary"
                        onClick={() => setShowModuleModal(false)}
                    />
                </div>
            </div>
        </div>
    );

    const renderFileModal = () => (
        <div className="modalOverlay">
            <div className="modalContent">
                <h3>Upload New File</h3>
                <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="modalInput"
                />
                <input
                    type="text"
                    value={fileDesc}
                    onChange={(e) => setFileDesc(e.target.value)}
                    placeholder="Enter description..."
                    className="modalInput"
                />
                <div className="modalActions">
                    <Button displayName="Create" variant="primary" onClick={uploadFileCallback} />
                    <Button
                        displayName="Cancel"
                        variant="secondary"
                        onClick={() => setShowFileModal(false)}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="classwork">
            <div className="header">
                <h2>Classwork</h2>
                <div className="createContainer">
                    {!join_course && (
                        <Button
                            displayName="＋ Create"
                            variant="primary"
                            onClick={() => setShowCreateMenu((prev) => !prev)}
                        />
                    )}
                    {showCreateMenu && renderCreateDropdown()}
                </div>
            </div>

            {/* Modules */}
            {modules.map((module) => (
                <div key={module.id} className="module">
                    <div className="moduleHeader" onClick={() => toggleModule(module.id)}>
                        <span>
                            <span className="moduleIcon">📦</span> {module.title}
                        </span>
                        <span>{expandedModules.includes(module.id) ? '▲' : '▼'}</span>
                    </div>

                    {expandedModules.includes(module.id) && (
                        <ul className="assignmentList">
                            {assignmentsByModule[module.id].map((assignment) => (
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

            {/* Unassigned Assignments */}
            {unassignedAssignments.length > 0 && (
                <div className="module unassigned">
                    <ul className="assignmentList">
                        {unassignedAssignments.map((assignment) => (
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

            {/* Files Section */}
            {files.length > 0 && (
                <div className="module filesSection">
                    <div
                        className="moduleHeader"
                        onClick={() => setIsFilesSectionOpen(!isFilesSectionOpen)}
                    >
                        <span>📄 Course Files</span>
                        <span>{isFilesSectionOpen ? '▲' : '▼'}</span>
                    </div>

                    {isFilesSectionOpen && (
                        <ul className="assignmentList">
                            {files.map((file) => (
                                <li key={file.id} className="assignmentItem">
                                    <a
                                        key={file.id}
                                        href={file.url}
                                        target="_blank"
                                        className="block px-4 py-2 text-blue-600 hover:underline"
                                    >
                                        📄 {file.filename}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {showModuleModal && renderModuleModal()}
            {showFileModal && renderFileModal()}
        </div>
    );
}
