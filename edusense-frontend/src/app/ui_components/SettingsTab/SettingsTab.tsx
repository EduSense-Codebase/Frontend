import React from 'react';
import './SettingsTab.scss';
import CategoriesPanel from './CategoriesPanel';
import TAPermissionsPanel from './TAPermissions';
import SectionsPanel from './SectionsPanel';

interface ISettingsTab {
    sections: string[];
    addSection: (newSection: string) => void;
}

const SettingsTab: React.FC<ISettingsTab> = (props) => {
    return (
        <div className="settings-tab">
            <div className="header">
                <h2>Course Settings</h2>
                <p className="subtitle">Manage categories, grading weights, and TA permissions.</p>
            </div>

            <div className="settings-grid">
                <CategoriesPanel />
                <TAPermissionsPanel />
                <SectionsPanel sections={props.sections} addSection={props.addSection} />
            </div>
        </div>
    );
};

export default SettingsTab;
