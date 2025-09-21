import React, { useState } from 'react';
import './SettingsTab.scss';

type Permissions = {
    create: boolean;
    edit: boolean;
    grade: boolean;
    upload: boolean;
};

interface Category {
    id: number;
    name: string;
    weight: number;
}

interface TA {
    id: number;
    name: string;
    email: string;
    permissions: Permissions;
}

const PERMISSIONS: (keyof Permissions)[] = ['create', 'edit', 'grade', 'upload'];

const SettingsTab: React.FC = () => {
    // mock data
    const [categories, setCategories] = useState<Category[]>([
        { id: 1, name: 'Participation', weight: 20 },
        { id: 2, name: 'Assignments', weight: 40 },
        { id: 3, name: 'Exams', weight: 40 },
    ]);

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

    // add-category form state
    const [newCategoryName, setNewCategoryName] = useState<string>('');
    const [newCategoryWeight, setNewCategoryWeight] = useState<number | ''>('');

    // add-ta form state
    const [newTAName, setNewTAName] = useState<string>('');
    const [newTAEmail, setNewTAEmail] = useState<string>('');
    const [newTAPermissions, setNewTAPermissions] = useState<Permissions>({
        create: false,
        edit: false,
        grade: false,
        upload: false,
    });

    const totalWeight = categories.reduce((s, c) => s + Number(c.weight || 0), 0);

    // category handlers
    const handleCategoryNameChange = (id: number, name: string) =>
        setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));

    const handleCategoryWeightChange = (id: number, weight: number) =>
        setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, weight } : c)));

    const addCategory = () => {
        if (!newCategoryName.trim()) {
            alert('Please enter a category name.');
            return;
        }
        const weightNumber = Number(newCategoryWeight);
        if (isNaN(weightNumber) || weightNumber < 0) {
            alert('Please enter a valid weight (0 or greater).');
            return;
        }
        const newCat: Category = {
            id: Date.now(),
            name: newCategoryName.trim(),
            weight: weightNumber,
        };
        setCategories((prev) => [...prev, newCat]);
        setNewCategoryName('');
        setNewCategoryWeight('');
    };

    const removeCategory = (id: number) => setCategories((prev) => prev.filter((c) => c.id !== id));

    // TA handlers
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
        <div className="settings-tab">
            <div className="header">
                <h2>Course Settings</h2>
                <p className="subtitle">Manage categories, grading weights, and TA permissions.</p>
            </div>

            <div className="settings-grid">
                {/* LEFT: Categories */}
                <div className="panel">
                    <h3>Categories & Weights</h3>

                    <div className="category-list">
                        {categories.map((cat) => (
                            <div key={cat.id} className="category-item">
                                <input
                                    className="cat-name"
                                    value={cat.name}
                                    onChange={(e) =>
                                        handleCategoryNameChange(cat.id, e.target.value)
                                    }
                                />
                                <div className="weight-wrap">
                                    <input
                                        className="weight-input"
                                        type="number"
                                        value={cat.weight}
                                        min={0}
                                        max={100}
                                        onChange={(e) =>
                                            handleCategoryWeightChange(
                                                cat.id,
                                                Number(e.target.value || 0),
                                            )
                                        }
                                    />
                                    <span className="percent">%</span>
                                </div>
                                <button
                                    className="btn btn-ghost remove-btn"
                                    onClick={() => removeCategory(cat.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="add-row">
                        <input
                            className="add-name"
                            placeholder="New category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <div className="add-weight">
                            <input
                                className="weight-input"
                                type="number"
                                placeholder="0"
                                value={newCategoryWeight === '' ? '' : String(newCategoryWeight)}
                                onChange={(e) =>
                                    setNewCategoryWeight(
                                        e.target.value === '' ? '' : Number(e.target.value),
                                    )
                                }
                                min={0}
                                max={100}
                            />
                            <span className="percent">%</span>
                        </div>
                        <button className="btn" onClick={addCategory}>
                            + Add Category
                        </button>
                    </div>

                    <div className="total-row">
                        <div>
                            Total weight: <strong>{totalWeight}%</strong>
                        </div>
                        {totalWeight !== 100 && (
                            <div
                                className={`weight-warning ${totalWeight > 100 ? 'over' : 'under'}`}
                            >
                                {totalWeight > 100
                                    ? 'Total > 100% — please adjust weights.'
                                    : 'Total ≠ 100% — recommended to sum to 100%.'}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: TAs */}
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
            </div>
        </div>
    );
};

export default SettingsTab;
