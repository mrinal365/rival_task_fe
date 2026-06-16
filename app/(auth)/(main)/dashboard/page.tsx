"use client";

import React, { useEffect, useState } from "react";
import { getAllTasksService, createTaskService } from "@/services/task.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setTasks, addTask } from "@/store/task.slice";
import { removeToken } from "@/utils/token";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import TaskTable from "@/components/feature/TaskTable";
import Select from "@/components/common/Select";
import Modal from "@/components/common/Modal";
import { SORT_OPTIONS, PRIORITY_OPTIONS } from "@/constants/task";

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const tasks = useAppSelector((state) => state.task.tasks);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and Sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState("created_at-desc");

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    const [sortBy, order] = sortValue.split("-");

    const delayDebounce = setTimeout(() => {
      getAllTasksService({ search: searchTerm, sortBy, order })
        .then((tasksList) => {
          dispatch(setTasks(tasksList));
        })
        .catch((err) => {
          setError(err || "Failed to fetch dashboard data");
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, sortValue, dispatch]);

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

    createTaskService({
      title,
      description,
      due_date: dueDate || undefined,
      priority,
    })
      .then((newTask) => {
        toast.success("Task created successfully");
        dispatch(addTask(newTask));
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("medium");
        setShowCreateModal(false);
      })
      .catch((err) => {
        setCreateError(err || "Failed to create task");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };



  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500 font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0f172a] font-sans flex flex-col">
      {/* Top Navbar */}
      <nav className="border-b border-[#e5e8ef] px-6 py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-40">
        <div className="flex items-center">
          <span className="text-2xl font-extrabold tracking-tighter text-[#0f172a] cursor-pointer" onClick={() => router.push("/dashboard")}>
            Rival.io
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#0f172a] leading-none m-0">{user.name}</p>
                  {user.role && (
                    <Badge variant="brand" className="text-[9px] font-extrabold uppercase tracking-wider !px-1.5 !py-0.5">
                      {user.role}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#6b7890] mt-1 m-0">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 border border-[#e5e8ef] hover:border-zinc-300 rounded-xl text-xs font-semibold text-[#3d4a66] hover:bg-zinc-50 transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a]">Task Manager</h1>
          <p className="text-sm text-[#6b7890] mt-1">Manage, organize, and track your team's tasks.</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#fafbfd] border border-[#e5e8ef] rounded-xl focus:outline-none focus:border-[#2957ff] focus:ring-1 focus:ring-[#2957ff] transition-all text-sm"
              />
            </div>

            <Select
              value={sortValue}
              onChange={setSortValue}
              options={SORT_OPTIONS}
            />
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-[#2957ff] text-white font-semibold text-sm rounded-xl hover:bg-[#1b43d6] transition-all cursor-pointer shadow-[0_1px_2px_rgba(41,87,255,0.2)] flex items-center gap-2 self-start md:self-auto"
          >
            Create Task
          </button>
        </div>

        {/* Active Chips */}
        {(searchTerm || sortValue !== "created_at-desc") && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {searchTerm && (
              <Badge variant="neutral" onClose={() => setSearchTerm("")}>
                Search: "{searchTerm}"
              </Badge>
            )}
            {sortValue !== "created_at-desc" && (
              <Badge variant="brand" onClose={() => setSortValue("created_at-desc")}>
                Sorted: {SORT_OPTIONS.find((opt) => opt.value === sortValue)?.label || ""}
              </Badge>
            )}
          </div>
        )}

        {/* Tasks Table */}
        <TaskTable tasks={tasks} loading={loading} />
      </main>

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setCreateError(null);
          setTitle("");
          setDescription("");
          setDueDate("");
          setPriority("medium");
        }}
        title="Create New Task"
      >
        {createError && <div className="text-red-500 text-xs mb-3">{createError}</div>}
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
            placeholder="Complete dashboard feature"
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#3d4a66] mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              placeholder="Task specifications..."
              className="w-full px-3.5 py-2.5 bg-[#fafbfd] border border-[#e5e8ef] rounded-xl focus:outline-none focus:border-[#2957ff] focus:ring-1 focus:ring-[#2957ff] transition-all text-sm min-h-[100px]"
            />
          </div>
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isSubmitting}
          />
          <Select
            label="Priority"
            value={priority}
            onChange={setPriority}
            position="relative"
            options={PRIORITY_OPTIONS}
          />
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setCreateError(null);
                setTitle("");
                setDescription("");
                setDueDate("");
                setPriority("medium");
              }}
              className="flex-1 py-2 border border-[#e5e8ef] hover:bg-zinc-50 font-semibold rounded-xl text-sm transition-all cursor-pointer text-[#3d4a66]"
            >
              Cancel
            </button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
