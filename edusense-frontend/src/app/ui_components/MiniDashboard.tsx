// components/MiniDashboard.tsx
import React, { useState } from 'react';

type Task = {
    id: number;
    title: string;
    status: 'pending' | 'completed';
};

type MiniDashboardProps = {
    tasks: Task[];
};

const MiniDashboard: React.FC<MiniDashboardProps> = ({ tasks }) => {
    const [taskList, setTaskList] = useState<Task[]>(tasks);

    const toggleTask = (id: number) => {
        setTaskList((prev) =>
            prev.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          status: task.status === 'completed' ? 'pending' : 'completed',
                      }
                    : task,
            ),
        );
    };

    return (
        <div className="absolute top-20 right-6 z-10 w-72 rounded-xl bg-white p-4 text-gray-700 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold">📋 To-Do</h3>
            <ul className="space-y-2 text-sm">
                {taskList.slice(0, 4).map((task) => (
                    <li key={task.id} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            onChange={() => toggleTask(task.id)}
                            className="accent-green-500"
                        />
                        <span
                            className={`truncate ${
                                task.status === 'completed' ? 'text-gray-400 line-through' : ''
                            }`}
                        >
                            {task.title}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MiniDashboard;
