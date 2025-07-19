"use client";

import { ITask } from "@/models/Task";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

interface TaskCardProps {
  task: ITask;
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task._id!);
    }
  };

  return (
    <div
      className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-2 shadow-md hover:shadow-blue-900 transition-all group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-semibold text-white text-base leading-5 flex-1 mr-2 tracking-tight">
          {task.title}
        </h3>
        {isHovered && (
          <div className="flex gap-1">
            <button
              onClick={handleEdit}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              title="Edit task"
            >
              <Edit2 size={15} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
              title="Delete task"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>
      {task.description && (
        <p className="text-gray-300 text-xs leading-5 line-clamp-3 mt-1">
          {task.description}
        </p>
      )}
      <div className="mt-3 text-xs text-gray-500 font-medium">
        {new Date(task.createdAt!).toLocaleDateString()}
      </div>
    </div>
  );
}
