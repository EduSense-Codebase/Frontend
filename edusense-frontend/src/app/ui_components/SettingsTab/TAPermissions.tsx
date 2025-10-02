import React, { useState, useEffect } from 'react';
import { httpGet, httpPost } from '@/app/utils';
import { API_PREFIX, COURSE_ENDPOINT } from '@/app/global';
import { useParams } from 'next/navigation';

interface TA {
    name: string;
    email: string;
    permissions: {
        create_annoucements: boolean;
        create_assignments: boolean;
        publish_assignments: boolean;
        grade_assignments: boolean;
        aigrade_assignments: boolean;
        submit_assignments: boolean;
        view_all_students: boolean;
        create_grade_categories: boolean;
        create_content_file: boolean;
        edit_course_homepage: boolean;
    };
}

interface TAResponse {
    data: TA[];
}

const EMPTY_PERMISSIONS: TA['permissions'] = {
    create_annoucements: false,
    create_assignments: false,
    publish_assignments: false,
    grade_assignments: false,
    aigrade_assignments: false,
    submit_assignments: false,
    view_all_students: false,
    create_grade_categories: false,
    create_content_file: false,
    edit_course_homepage: false,
};

const PERMISSION_GROUPS: Record<string, (keyof TA['permissions'])[]> = {
    Create: [
        'create_annoucements',
        'create_assignments',
        'create_grade_categories',
        'create_content_file',
    ],
    Edit: ['edit_course_homepage', 'publish_assignments'],
    Grade: ['grade_assignments', 'aigrade_assignments', 'view_all_students'],
    Upload: ['submit_assignments'],
};

const TAPermissionsPanel: React.FC = () => {
    const [tas, setTAs] = useState<TA[]>([]);
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;

    const [newTAName, setNewTAName] = useState('');
    const [newTAEmail, setNewTAEmail] = useState('');
    const [newTAPermissions, setNewTAPermissions] = useState<TA['permissions']>(EMPTY_PERMISSIONS);

    useEffect(() => {
        const url = API_PREFIX + COURSE_ENDPOINT;
        const queryParams = { section: 'get_tas', course_id: enrollmentId };
        httpGet<TAResponse>(url, queryParams).then((res) => {
            console.log('TA fetch:', res.data);
            setTAs(res.data.data);
        });
    }, [enrollmentId]);

    const togglePermission = (index: number, perm: keyof TA['permissions']) =>
        setTAs((prev) =>
            prev.map((ta, i) =>
                i === index
                    ? {
                          ...ta,
                          permissions: {
                              ...ta.permissions,
                              [perm]: !ta.permissions[perm],
                          },
                      }
                    : ta,
            ),
        );

    const isValidEmail = (s: string) => /\S+@\S+\.\S+/.test(s);

    const addTA = () => {
        if (!newTAName.trim()) {
            alert('Please enter TA name.');
            return;
        }
        if (!isValidEmail(newTAEmail)) {
            alert('Please enter a valid email for TA.');
            return;
        }
        const newTa: TA = {
            name: newTAName.trim(),
            email: newTAEmail.trim(),
            permissions: { ...newTAPermissions },
        };
        //

        // reset fields
        setNewTAName('');
        setNewTAEmail('');
        setNewTAPermissions(EMPTY_PERMISSIONS);

        // persist to backend
        const url = API_PREFIX + COURSE_ENDPOINT;
        const queryParams = { section: 'add_ta' };
        const formData = {
            course_id: enrollmentId,
            name: newTa.name,
            email: newTa.email,
            permissions: newTa.permissions,
        };
        httpPost<TA>(url, formData, queryParams).then((res) => {
            console.log('TA saved:', res);
            setTAs((prev) => [...prev, newTa]);
        });
    };

    return (
        <div className="panel">
            <h3>Teaching Assistants</h3>

            <div className="ta-list">
                {tas.map((ta, index) => (
                    <div className="ta-card" key={index}>
                        <div className="ta-left">
                            <div className="ta-name">{ta.name}</div>
                            <div className="ta-email">{ta.email}</div>
                        </div>

                        <div className="ta-perms">
                            {Object.entries(PERMISSION_GROUPS).map(([groupName, perms]) => (
                                <div key={groupName} className="perm-group">
                                    <h4 className="group-title">{groupName}</h4>
                                    {perms.map((perm) => (
                                        <label key={perm} className="perm-label">
                                            <input
                                                type="checkbox"
                                                checked={ta.permissions[perm]}
                                                onChange={() => togglePermission(index, perm)}
                                            />
                                            <span className="perm-name">{perm}</span>
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="add-ta">
                <input
                    className="add-name"
                    placeholder="TA name"
                    value={newTAName}
                    onChange={(e) => setNewTAName(e.target.value)}
                />
                <input
                    className="add-email"
                    placeholder="TA email"
                    value={newTAEmail}
                    onChange={(e) => setNewTAEmail(e.target.value)}
                />

                <div className="new-ta-perms">
                    {Object.entries(PERMISSION_GROUPS).map(([groupName, perms]) => (
                        <div key={groupName} className="perm-group">
                            <h4 className="group-title">{groupName}</h4>
                            {perms.map((perm) => (
                                <label key={perm} className="perm-label small">
                                    <input
                                        type="checkbox"
                                        checked={newTAPermissions[perm]}
                                        onChange={(e) =>
                                            setNewTAPermissions((p) => ({
                                                ...p,
                                                [perm]: e.target.checked,
                                            }))
                                        }
                                    />
                                    <span className="perm-name">{perm}</span>
                                </label>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="add-row">
                    <button className="btn" onClick={addTA}>
                        + Add TA
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TAPermissionsPanel;
