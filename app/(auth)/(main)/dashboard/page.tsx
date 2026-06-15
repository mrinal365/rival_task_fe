"use client";

import React, { useEffect, useState } from "react";
import { getAllTasksService, createTaskService } from "@/services/task.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { removeToken } from "@/utils/token";

interface Task {
  id: number;
  title: string;
  description?: string;
  status?: string;
}

const Dashboard = () => {
  const router = useRouter();
  const tasksRes = useAppSelector((state) => state.auth.user);
  const user = tasksRes;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAllTasksService()
      .then((res) => {
        const taskList = res?.data?.tasks || [];
        setTasks(taskList);
      })
      .catch((err) => {
        setError(err || "Failed to fetch dashboard data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    removeToken();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setCreateError(null);

    createTaskService({ title, description })
      .then((res) => {
        toast.success(res?.message || "Task created successfully");
        // Clear inputs after success
        setTitle("");
        setDescription("");
      })
      .catch((err) => {
        setCreateError(err || "Failed to create task");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-5">
      {/* User Header */}
      {user && (
        <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold m-0">Welcome, {user.name}</h2>
              <p className="text-gray-500 m-0">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-1.5 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
            Logout
          </button>
        </div>
      )}

      <h1 className="text-3xl font-extrabold mb-6">Dashboard</h1>

      {/* Create Task Box */}
      <div className="border border-gray-300 p-4 mb-5 max-w-[400px] rounded">
        <h3 className="text-lg font-bold mb-3">Create New Task</h3>
        {createError && <div className="text-red-500 mb-2">{createError}</div>}
        <form onSubmit={handleCreateTask}>
          <div className="mb-3">
            <label className="block font-medium mb-1">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full p-1 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium mb-1">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-1 border border-gray-300 rounded"
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 bg-black text-white rounded cursor-pointer disabled:opacity-50">
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-bold mb-4">Tasks:</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <p key={task.id} className="mb-2">
            <strong className="font-semibold">{task.title}</strong> - {task.description || "No description"} ({task.status || "no status"})
          </p>
        ))
      )}
    </div>
  );
};

export default Dashboard;
