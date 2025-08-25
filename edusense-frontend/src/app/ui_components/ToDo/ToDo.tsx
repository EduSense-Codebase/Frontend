import React from 'react';
import './ToDo.scss';
import { IAssignments } from '@/app/typedef';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ToDo({
    editMode,
    setShowToDo,
    assignments,
}: {
    editMode: boolean;
    setShowToDo: React.Dispatch<React.SetStateAction<boolean>>;
    assignments: IAssignments[];
}){
    const {enrollmentId} = useParams();
    return (
        <div className="todo-container">
            {editMode && (
                <button
                    className="todo-close"
                    onClick={() => setShowToDo(false)}
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
                        {
                            <Link href={`/portal/builder/${enrollmentId}/${assignment.builder}`}>
                                {assignment.name}
                            </Link>
                        }
                    </div>
                ))
            )}
        </div>
    );
}
