"use client";

import { ITask } from "@/models/Task";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";

interface TaskColumnProps {
  title: string;
  status: "todo" | "doing" | "done";
  tasks: ITask[];
  onAddTask: (status: "todo" | "doing" | "done") => void;
  onEditTask: (task: ITask) => void;
  onDeleteTask: (taskId: string) => void;
  onDropTask: (taskId: string, newStatus: "todo" | "doing" | "done") => void;
}

export default function TaskColumn({
  title,
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDropTask,
}: TaskColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onDropTask(taskId, status);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  return (
    <div
      className="bg-gray-100 shadow-2xl border  rounded-lg p-4 h-fit min-h-[500px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800 text-lg">{title}</h2>
        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <button
        onClick={() => onAddTask(status)}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 mb-4 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Add Task
      </button>

      <div className="space-y-0">
        {tasks.map((task) => (
          <div
            key={task._id}
            draggable
            onDragStart={(e) => handleDragStart(e, task._id!)}
            className="cursor-move"
          >
            <TaskCard task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          </div>
        ))}
      </div>
    </div>
  );
}
