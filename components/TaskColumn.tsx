"use client";

import { ITask } from "@/models/Task";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";

interface TaskColumnProps {
  title: string;
  status: "todo" | "doing" | "done" | "backlog";
  tasks: ITask[];
  onAddTask: (status: "todo" | "doing" | "done" | "backlog") => void;
  onEditTask: (task: ITask) => void;
  onDeleteTask: (taskId: string) => void;
  onDropTask: (taskId: string, newStatus: "todo" | "doing" | "done" | "backlog") => void;
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
      className="bg-gradient-to-br from-black via-slate-900 to-gray-900 shadow-2xl border border-slate-800 rounded-2xl p-6 h-fit min-h-[520px] transition-all hover:shadow-blue-900"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-white text-lg tracking-tight drop-shadow-sm">
          {title}
        </h2>
        <span className="bg-slate-800 text-gray-200 text-xs px-3 py-1 rounded-full shadow-sm font-semibold border border-gray-700">
          {tasks.length}
        </span>
      </div>

      <button
        onClick={() => onAddTask(status)}
        className="w-full border-2 border-dashed border-slate-700 rounded-xl p-3 mb-6 text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 bg-black/60"
      >
        <Plus size={18} className="text-blue-500" />
        Add Task
      </button>

      <div className="space-y-2">
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
