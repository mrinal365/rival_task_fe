"use client";

import React, { useEffect, useState } from "react";
import { getAllTasksService } from "@/services/task.service";

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

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
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