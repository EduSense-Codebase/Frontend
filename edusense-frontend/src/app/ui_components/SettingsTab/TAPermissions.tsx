import React, { useState, useEffect } from 'react';
import { httpGet, httpPost } from '@/app/utils';
import { API_PREFIX, COURSE_ENDPOINT } from '@/app/global';
import { useParams } from 'next/navigation';
import Button from '../Button';

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

// helper to check if all perms in a group are true
const isGroupSelected = (permissions: TA['permissions'], group: (keyof TA['permissions'])[]) =>
    group.every((perm) => permissions[perm]);

// helper to toggle a group
const toggleGroup = (
    permissions: TA['permissions'],
    group: (keyof TA['permissions'])[],
    value: boolean,
): TA['permissions'] => {
    const updated = { ...permissions };
    group.forEach((perm) => {
        updated[perm] = value;
    });
    return updated;
};

const TAPermissionsPanel: React.FC = () => {
    const [tas, setTAs] = useState<TA[]>([]);
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;

    const [newTAEmail, setNewTAEmail] = useState('');
    const [newTAPermissions, setNewTAPermissions] = useState<TA['permissions']>(EMPTY_PERMISSIONS);

    useEffect(() => {
        const url = API_PREFIX + COURSE_ENDPOINT;
        const queryParams = { section: 'get_tas', course_id: enrollmentId };
        httpGet<TAResponse>(url, queryParams).then((res) => {
            console.log('TA fetch:', res.data);
            setTAs(res.data.data);
        });
    }, []);

    // const toggleGroupForTA = (index: number, groupName: string) => {
    //     const groupPerms = PERMISSION_GROUPS[groupName];
    //     setTAs((prev) =>
    //         prev.map((ta, i) =>
    //             i === index
    //                 ? {
    //                       ...ta,
    //                       permissions: toggleGroup(
    //                           ta.permissions,
    //                           groupPerms,
    //                           !isGroupSelected(ta.permissions, groupPerms),
    //                       ),
    //                   }
    //                 : ta,
    //         ),
    //     );
    // };

    const isValidEmail = (s: string) => /\S+@\S+\.\S+/.test(s);

    const addTA = () => {
        if (!isValidEmail(newTAEmail)) {
            alert('Please enter a valid email for TA.');
            return;
        }

        const url = API_PREFIX + COURSE_ENDPOINT;
        const queryParams = { section: 'add_ta' };
        const formData = {
            course_id: enrollmentId,
            email: newTAEmail,
            permissions: JSON.stringify(newTAPermissions),
        };
        httpPost<TA>(url, formData, queryParams).then((res) => {
            console.log('TA saved:', res.data);
            setNewTAEmail('');
            setNewTAPermissions(EMPTY_PERMISSIONS);
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
                            {Object.entries(PERMISSION_GROUPS).map(([groupName, perms]) =>
                                isGroupSelected(ta.permissions, perms) ? (
                                    <span key={groupName} className="perm-name">
                                        {groupName}
                                    </span>
                                ) : null,
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="add-ta">
                <input
                    className="add-email"
                    placeholder="TA email"
                    value={newTAEmail}
                    onChange={(e) => setNewTAEmail(e.target.value)}
                />

                <div className="new-ta-perms">
                    {Object.entries(PERMISSION_GROUPS).map(([groupName, perms]) => (
                        <label key={groupName} className="perm-label small">
                            <input
                                type="checkbox"
                                checked={isGroupSelected(newTAPermissions, perms)}
                                onChange={(e) =>
                                    setNewTAPermissions((prev) =>
                                        toggleGroup(prev, perms, e.target.checked),
                                    )
                                }
                            />
                            <span className="perm-name">{groupName}</span>
                        </label>
                    ))}
                </div>

                <div className="add-row">
                    <Button displayName="+ Add TA" variant="primary" onClick={addTA} />
                </div>
            </div>
        </div>
    );
};

export default TAPermissionsPanel;
