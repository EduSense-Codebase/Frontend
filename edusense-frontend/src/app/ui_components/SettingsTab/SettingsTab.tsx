import React from 'react';
import './SettingsTab.scss';
import CategoriesPanel from './CategoriesPanel';
import TAPermissionsPanel from './TAPermissions';

const SettingsTab: React.FC = () => {
    return (
        <div className="settings-tab">
            <div className="header">
                <h2>Course Settings</h2>
                <p className="subtitle">Manage categories, grading weights, and TA permissions.</p>
            </div>

            <div className="settings-grid">
                <CategoriesPanel />
                <TAPermissionsPanel />
            </div>
        </div>
    );
};

export default SettingsTab;
