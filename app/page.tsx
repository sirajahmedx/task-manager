"use client";

import { useState, useEffect } from "react";
import { ITask } from "@/models/Task";
import TaskColumn from "@/components/TaskColumn";
import TaskModal from "@/components/TaskModal";
import { Kanban } from "lucide-react";
import { signOut, useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home(): JSX.Element {
  const { data: session, status } = useSession();
  const user = session?.user?.id;

  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<
    "todo" | "doing" | "done" | "backlog"
  >("todo");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (): Promise<void> => {
    if (!user) {
      console.log("User ID is not available yet.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/tasks?user=${user}`);
      const data = await response.json();

      if (data.success) {
        setTasks(data.data);
      } else {
        const errorMessage = data.error || "Failed to fetch tasks";
        console.error("Failed to fetch tasks:", errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      const errorMessage = "Error fetching tasks";
      console.error(errorMessage, error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && user) {
      fetchTasks();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setTasks([]);
    }
  }, [user, status]);

  const handleSubmitTask = async (taskData: Partial<ITask>): Promise<void> => {
    if (!user) {
      alert("Please sign in to save tasks.");
      return;
    }

    try {
      const { ...rest } = taskData;
      const updatedTaskData = { ...rest, user };
      const isEditing = selectedTask !== null;
      const url = isEditing ? `/api/tasks/${selectedTask._id}` : "/api/tasks";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTaskData),
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
        setIsModalOpen(false);
      } else {
        alert(data.error || "Failed to save task");
      }
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Error saving task");
    }
  };

  const handleDeleteTask = async (taskId: string): Promise<void> => {
    if (!user) {
      alert("Please sign in to delete tasks.");
      return;
    }

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

  const handleDropTask = async (
    taskId: string,
    newStatus: "todo" | "doing" | "done" | "backlog"
  ): Promise<void> => {
    if (!user) {
      alert("Please sign in to update tasks.");
      return;
    }

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

  const handleAddTask = (
    status: "todo" | "doing" | "done" | "backlog"
  ): void => {
    if (!user) {
      alert("Please sign in to add tasks.");
      return;
    }
    setSelectedTask(null);
    setDefaultStatus(status);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: ITask): void => {
    if (!user) {
      alert("Please sign in to edit tasks.");
      return;
    }
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleSignIn = (): void => {
    signIn();
  };

  const handleSignOut = (): void => {
    signOut();
  };

  // Show loading spinner while session is loading
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show sign-in prompt for unauthenticated users
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Kanban className="text-blue-500 mx-auto mb-4" size={48} />
          <h1 className="text-3xl font-bold mb-4">Task Manager</h1>
          <p className="text-gray-400 mb-6">
            Please sign in to manage your tasks
          </p>
          <button
            onClick={handleSignIn}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-all duration-150"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => fetchTasks()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-all duration-150"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const backlogTasks = tasks.filter((task) => task.status === "backlog");
  const doingTasks = tasks.filter((task) => task.status === "doing");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/80 border-b border-slate-800 py-3 shadow-lg backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Kanban
              className="text-blue-500 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]"
              size={30}
            />
            <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-[0_0_8px_rgba(37,99,235,0.15)]">
              Task Manager
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold shadow transition-all duration-150"
            >
              Sign Out
            </button>
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-900/70 border border-slate-800">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-lg font-semibold text-white">
                    {session?.user?.name
                      ? session.user.name[0].toUpperCase()
                      : "U"}
                  </span>
                )}
              </div>
              <span className="text-sm text-white font-medium">
                {session?.user?.name || session?.user?.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <TaskColumn
            title="Back-Log"
            status="backlog"
            tasks={backlogTasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onDropTask={handleDropTask}
          />
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
