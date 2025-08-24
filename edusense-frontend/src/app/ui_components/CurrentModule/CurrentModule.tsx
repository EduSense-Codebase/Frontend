import React from 'react';
import './CurrentModule.scss';

const CurrentModule: React.FC<{
    moduleName: string;
    editMode: boolean;
    setModule: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ moduleName, editMode, setModule }) => {

    return (
        <div className="current-module-container">
            {editMode && (
                <button
                    className="todo-close"
                    onClick={() => setModule(false)}
                    aria-label="Close To-Do"
                >
                    ×
                </button>
            )}
            <div className="current-module-box">
                <div className="current-module-title">Current Module</div>
                <ul className="current-module-list">
                    <li className="current-module-item">
                        <span>📘</span>
                        {!moduleName ? <p> No module selected</p> : <p>{moduleName}</p>}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default CurrentModule;
