import React, { useState } from 'react';
import './CurrentModule.scss';
import { motion, AnimatePresence } from 'framer-motion';

const CurrentModule: React.FC<{
    moduleName: string;
    editMode: boolean;
    setModule: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ moduleName, editMode, setModule }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        // trigger exit animation
        setIsVisible(false);
        setTimeout(() => setModule(false), 300); // match animation duration
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="current-module-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, height: 0, margin: 0, padding: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    {editMode && (
                        <button
                            className="todo-close"
                            onClick={handleClose}
                            aria-label="Close Current Module"
                        >
                            ×
                        </button>
                    )}
                    <div className="current-module-box">
                        <div className="current-module-title">Current Module</div>
                        <ul className="current-module-list">
                            <li className="current-module-item">
                                <span>📘</span>
                                {!moduleName ? <p>No module selected</p> : <p>{moduleName}</p>}
                            </li>
                        </ul>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CurrentModule;
