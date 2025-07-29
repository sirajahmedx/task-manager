"use client";

import { ITask } from "@/models/Task";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<ITask>) => void;
  task?: ITask | null;
  defaultStatus?: "todo" | "doing" | "done";
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  task,
  defaultStatus = "todo",
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"todo" | "doing" | "done">(
    defaultStatus
  );

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
    } else {
      setTitle("");
      setDescription("");
      setStatus(defaultStatus);
    }
  }, [task, defaultStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-gray-900/80 to-blue-950/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-800 animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-blue-400 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-200 mb-2"
            >
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-100 placeholder-gray-500 transition-all shadow-sm"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-200 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-100 placeholder-gray-500 transition-all shadow-sm resize-none"
              placeholder="Enter task description (optional)"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-semibold text-gray-200 mb-2"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "todo" | "doing" | "done")
              }
              className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-100 transition-all shadow-sm"
            >
              <option value="todo">To-Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-gray-200 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm border border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm border border-blue-600"
            >
              {task ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
