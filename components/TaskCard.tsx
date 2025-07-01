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
      className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-md hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 text-sm leading-5 flex-1 mr-2">
          {task.title}
        </h3>
        {isHovered && (
          <div className="flex gap-1">
            <button
              onClick={handleEdit}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit task"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
      {task.description && (
        <p className="text-gray-600 text-xs leading-4 line-clamp-3">
          {task.description}
        </p>
      )}
      <div className="mt-2 text-xs text-gray-400">
        {new Date(task.createdAt!).toLocaleDateString()}
      </div>
    </div>
  );
}
