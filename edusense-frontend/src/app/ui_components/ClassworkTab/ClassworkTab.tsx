'use client';
import React, { useState } from 'react';
import './ClassworkTab.scss';
import { IModules, IAssignments, IModuleResponse, IFile, IOneFileResponse } from '@/app/typedef';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { API_PREFIX, COURSE_ENDPOINT } from '@/app/global';
import { httpPost } from '@/app/utils';

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
    const [pdfToView, setPdfToView] = useState<string | null>(null);
    const [isFilesSectionOpen, setIsFilesSectionOpen] = useState(false);

    const { enrollmentId } = useParams();

    const toggleModule = (id: number) => {
        setExpandedModules((prev) =>
            prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id],
        );
    };

    const handleCreateSelect = (type: 'assignment' | 'module' | 'file') => {
        setShowCreateMenu(false);
        if (type === 'module') {
            setShowModuleModal(true);
        } else if (type === 'file') {
            setShowFileModal(true);
        } else {
            console.log('Create assignment clicked');
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
                    <button className="modalBtn submit" onClick={createModuleCallback}>
                        Create
                    </button>
                    <button className="modalBtn cancel" onClick={() => setShowModuleModal(false)}>
                        Cancel
                    </button>
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
                    <button className="modalBtn submit" onClick={uploadFileCallback}>
                        Upload
                    </button>
                    <button className="modalBtn cancel" onClick={() => setShowFileModal(false)}>
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
                    {!join_course && (
                        <button
                            className="createBtn"
                            onClick={() => setShowCreateMenu((prev) => !prev)}
                        >
                            ＋ Create
                        </button>
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
                                    {file.filename.toLowerCase().endsWith('.pdf') ? (
                                        <button
                                            onClick={() => setPdfToView(file.url)}
                                            className="pdfBtn"
                                        >
                                            📄 {file.filename}
                                        </button>
                                    ) : (
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            📄 {file.filename}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {showModuleModal && renderModuleModal()}
            {showFileModal && renderFileModal()}

            {pdfToView && (
                <div className="pdfViewerModal">
                    <div className="pdfViewerContent">
                        <button onClick={() => setPdfToView(null)} className="closeBtn">
                            ✖ Close
                        </button>
                        <iframe
                            src={pdfToView}
                            width="100%"
                            height="600px"
                            style={{ border: 'none' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
