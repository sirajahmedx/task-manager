"use client";

import { useState, useEffect } from "react";
import { ITask } from "@/models/Task";
import TaskColumn from "@/components/TaskColumn";
import TaskModal from "@/components/TaskModal";
import { Kanban } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<"todo" | "doing" | "done">(
    "todo"
  );
  const [loading, setLoading] = useState(true);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();

      if (data.success) {
        setTasks(data.data);
      } else {
        console.error("Failed to fetch tasks:", data.error);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create or update task
  const handleSubmitTask = async (taskData: Partial<ITask>) => {
    try {
      const isEditing = selectedTask !== null;
      const url = isEditing ? `/api/tasks/${selectedTask._id}` : "/api/tasks";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (data.success) {
        if (isEditing) {
          setTasks(
            tasks.map((task) =>
              task._id === selectedTask._id ? data.data : task
            )
          );
        } else {
          setTasks([data.data, ...tasks]);
        }
        setSelectedTask(null);
      } else {
        alert(data.error || "Failed to save task");
      }
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Error saving task");
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setTasks(tasks.filter((task) => task._id !== taskId));
      } else {
        alert(data.error || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task");
    }
  };

  // Handle drag and drop
  const handleDropTask = async (
    taskId: string,
    newStatus: "todo" | "doing" | "done"
  ) => {
    const taskToUpdate = tasks.find((task) => task._id === taskId);
    if (!taskToUpdate || taskToUpdate.status === newStatus) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...taskToUpdate,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTasks(
          tasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      } else {
        alert(data.error || "Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Error updating task status");
    }
  };

  // Open modal for adding task
  const handleAddTask = (status: "todo" | "doing" | "done") => {
    setSelectedTask(null);
    setDefaultStatus(status);
    setIsModalOpen(true);
  };

  // Open modal for editing task
  const handleEditTask = (task: ITask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Group tasks by status
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const doingTasks = tasks.filter((task) => task.status === "doing");
  const doneTasks = tasks.filter((task) => task.status === "done");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Kanban className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn
            title="To-Do"
            status="todo"
            tasks={todoTasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onDropTask={handleDropTask}
          />
          <TaskColumn
            title="Doing"
            status="doing"
            tasks={doingTasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onDropTask={handleDropTask}
          />
          <TaskColumn
            title="Done"
            status="done"
            tasks={doneTasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onDropTask={handleDropTask}
          />
        </div>
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        task={selectedTask}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
