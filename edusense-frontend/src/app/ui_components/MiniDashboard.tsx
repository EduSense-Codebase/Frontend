// components/MiniDashboard.tsx
import React, { useState } from "react";

type Task = {
  id: number;
  title: string;
  status: "pending" | "completed";
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
              status: task.status === "completed" ? "pending" : "completed",
            }
          : task
      )
    );
  };

  return (
    <div className="absolute top-20 right-6 bg-white text-gray-700 shadow-xl rounded-xl p-4 w-72 z-10">
      <h3 className="text-lg font-semibold mb-3">📋 To-Do</h3>
      <ul className="space-y-2 text-sm">
        {taskList.slice(0, 4).map((task) => (
          <li key={task.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={task.status === "completed"}
              onChange={() => toggleTask(task.id)}
              className="accent-green-500"
            />
            <span
              className={`truncate ${
                task.status === "completed" ? "line-through text-gray-400" : ""
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
