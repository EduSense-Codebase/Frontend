import React, { useState } from 'react';
import './ToDo.scss';
import { IAssignments } from '@/app/typedef';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToDo({
    editMode,
    setShowToDo,
    assignments,
}: {
    editMode: boolean;
    setShowToDo: React.Dispatch<React.SetStateAction<boolean>>;
    assignments: IAssignments[];
}) {
    const { enrollmentId } = useParams();
    const [isVisible, setIsVisible] = useState(true);
    console.log(new Date(assignments[0].due).getTime());
    assignments = assignments.filter(
        (assignment) => new Date(assignment.due).getTime() > Date.now(),
    );
    assignments = assignments.slice(0, 3);

    const handleClose = () => {
        // Trigger animation
        setIsVisible(false);
        // Delay state change so motion finishes
        setTimeout(() => setShowToDo(false), 300);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="todo-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, height: 0, margin: 0, padding: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    {editMode && (
                        <button
                            className="todo-close"
                            onClick={handleClose}
                            aria-label="Close To-Do"
                        >
                            ×
                        </button>
                    )}

                    <h3 className="todo-title">Upcoming Assignments</h3>
                    {assignments.length === 0 ? (
                        <p className="text-gray-500 italic">No assignments posted yet</p>
                    ) : (
                        assignments.map((assignment, idx) => (
                            <div key={idx} className="todo-item">
                                <Link
                                    href={`/portal/builder/${enrollmentId}/${assignment.builder}`}
                                >
                                    {assignment.name}
                                </Link>
                            </div>
                        ))
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
