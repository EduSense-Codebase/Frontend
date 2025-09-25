import React, { useState } from 'react';

type Permissions = {
    create: boolean;
    edit: boolean;
    grade: boolean;
    upload: boolean;
};

interface TA {
    id: number;
    name: string;
    email: string;
    permissions: Permissions;
}

const PERMISSIONS: (keyof Permissions)[] = ['create', 'edit', 'grade', 'upload'];

const TAPermissionsPanel: React.FC = () => {
    const [tas, setTAs] = useState<TA[]>([
        {
            id: 1,
            name: 'Alex Johnson',
            email: 'alex.johnson@example.com',
            permissions: { create: true, edit: true, grade: true, upload: false },
        },
        {
            id: 2,
            name: 'Taylor Smith',
            email: 'taylor.smith@example.com',
            permissions: { create: false, edit: false, grade: true, upload: true },
        },
    ]);

    const [newTAName, setNewTAName] = useState<string>('');
    const [newTAEmail, setNewTAEmail] = useState<string>('');
    const [newTAPermissions, setNewTAPermissions] = useState<Permissions>({
        create: false,
        edit: false,
        grade: false,
        upload: false,
    });

    const togglePermission = (taId: number, perm: keyof Permissions) =>
        setTAs((prev) =>
            prev.map((ta) =>
                ta.id === taId
                    ? { ...ta, permissions: { ...ta.permissions, [perm]: !ta.permissions[perm] } }
                    : ta,
            ),
        );

    const setNewPermission = (perm: keyof Permissions, value: boolean) =>
        setNewTAPermissions((p) => ({ ...p, [perm]: value }));

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
            id: Date.now(),
            name: newTAName.trim(),
            email: newTAEmail.trim(),
            permissions: { ...newTAPermissions },
        };
        setTAs((prev) => [...prev, newTa]);
        setNewTAName('');
        setNewTAEmail('');
        setNewTAPermissions({ create: false, edit: false, grade: false, upload: false });
    };

    const removeTA = (id: number) => setTAs((prev) => prev.filter((t) => t.id !== id));

    return (
        <div className="panel">
            <h3>Teaching Assistants</h3>

            <div className="ta-list">
                {tas.map((ta) => (
                    <div className="ta-card" key={ta.id}>
                        <div className="ta-left">
                            <div className="ta-name">{ta.name}</div>
                            <div className="ta-email">{ta.email}</div>
                        </div>

                        <div className="ta-perms">
                            {PERMISSIONS.map((perm) => (
                                <label key={perm} className="perm-label">
                                    <input
                                        type="checkbox"
                                        checked={ta.permissions[perm]}
                                        onChange={() => togglePermission(ta.id, perm)}
                                    />
                                    <span className="perm-name">{perm}</span>
                                </label>
                            ))}
                        </div>

                        <div className="ta-actions">
                            <button
                                className="btn btn-ghost remove-btn"
                                onClick={() => removeTA(ta.id)}
                            >
                                Remove
                            </button>
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
                    {PERMISSIONS.map((perm) => (
                        <label key={perm} className="perm-label small">
                            <input
                                type="checkbox"
                                checked={newTAPermissions[perm]}
                                onChange={(e) => setNewPermission(perm, e.target.checked)}
                            />
                            <span className="perm-name">{perm}</span>
                        </label>
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
