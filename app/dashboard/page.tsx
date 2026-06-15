"use client";

import React, { useEffect, useState } from "react";
import { getAllTasksService, createTaskService } from "@/services/task.service";
import { toast } from "react-toastify";

interface Task {
  id: number;
  title: string;
  description?: string;
  status?: string;
}

const Dashboard = () => {
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
        setError(err || "Failed to fetch tasks");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setCreateError(null);

    createTaskService({ title, description })
      .then((res) => {
        toast.success(res?.message || "Task created successfully");
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
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {/* Create Task Box */}
      <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px", maxWidth: "400px" }}>
        <h3>Create New Task</h3>
        {createError && <div style={{ color: "red", marginBottom: "10px" }}>{createError}</div>}
        <form onSubmit={handleCreateTask}>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block" }}>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              style={{ width: "100%", padding: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block" }}>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              style={{ width: "100%", padding: "5px" }}
            />
          </div>
          <button type="submit" disabled={isSubmitting} style={{ padding: "5px 10px", cursor: "pointer" }}>
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>

      <h2>Tasks:</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <p key={task.id}>
            <strong>{task.title}</strong> - {task.description || "No description"} ({task.status || "no status"})
          </p>
        ))
      )}
    </div>
  );
};

export default Dashboard;