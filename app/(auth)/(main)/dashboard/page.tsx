"use client";

import React, { useEffect, useState } from "react";
import { getAllTasksService, createTaskService, getTaskByIdService, updateTaskService, deleteTaskService, getTaskHistoryService } from "@/services/task.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setTasks, addTask, updateTask, deleteTask, Task } from "@/store/task.slice";
import { removeToken } from "@/utils/token";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import TaskTable from "@/components/feature/TaskTable";
import Select from "@/components/common/Select";
import Modal from "@/components/common/Modal";
import { SORT_OPTIONS, PRIORITY_OPTIONS } from "@/constants/task";
import Pagination from "@/components/common/Pagination";

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

  // Pagination state
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  } | null>(null);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Task Detail Modal State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Task History Accordion State
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Task Delete Modal State
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Refresh trigger state
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Reset page to 1 when search or sorting changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, sortValue]);

  // Reset accordion when detail modal closes
  useEffect(() => {
    if (!showDetailModal) {
      setIsHistoryExpanded(false);
      setHistory([]);
      setLoadingHistory(false);
      setHistoryError(null);
    }
  }, [showDetailModal]);

  useEffect(() => {
    setLoading(true);
    const [sortBy, order] = sortValue.split("-");

    const delayDebounce = setTimeout(() => {
      getAllTasksService({ search: searchTerm, sortBy, order, page, limit: 10 })
        .then((res) => {
          dispatch(setTasks(res?.tasks || []));
          setPagination(res?.pagination || null);
        })
        .catch((err) => {
          setError(err || "Failed to fetch dashboard data");
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, sortValue, page, refreshTrigger, dispatch]);

  const handleLogout = () => {
    removeToken();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
    setLoadingDetail(true);
    setDetailError(null);

    getTaskByIdService(task.id)
      .then((detail) => {
        setSelectedTask(detail);
      })
      .catch((err) => {
        // Fallback to table task info if API fails/offline
        console.error("Failed to fetch full task details", err);
      })
      .finally(() => {
        setLoadingDetail(false);
      });
  };

  const toggleHistoryAccordion = () => {
    const nextState = !isHistoryExpanded;
    setIsHistoryExpanded(nextState);

    // If expanding and history is not loaded yet, fetch it!
    if (nextState && selectedTask && history.length === 0) {
      setLoadingHistory(true);
      setHistoryError(null);
      getTaskHistoryService(selectedTask.id)
        .then((data) => {
          setHistory(data || []);
        })
        .catch((err) => {
          setHistoryError(err || "Failed to load activity log");
        })
        .finally(() => {
          setLoadingHistory(false);
        });
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.due_date ? new Date(task.due_date).toISOString().split("T")[0] : "");
    setPriority(task.priority || "medium");
    setStatus(task.status || "todo");
    setShowCreateModal(true);
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!taskToDelete) return;
    setIsDeleting(true);

    deleteTaskService(taskToDelete.id)
      .then(() => {
        toast.success("Task deleted successfully");
        dispatch(deleteTask(taskToDelete.id));
        setShowDeleteModal(false);
        setTaskToDelete(null);
      })
      .catch((err) => {
        toast.error(err || "Failed to delete task");
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingTask(null);
    setCreateError(null);
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setStatus("todo");
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
        handleCloseModal();
      })
      .catch((err) => {
        setCreateError(err || "Failed to create task");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !title.trim()) return;

    setIsSubmitting(true);
    setCreateError(null);

    updateTaskService(editingTask.id, {
      title,
      description,
      due_date: dueDate || undefined,
      priority,
      status,
    })
      .then((updatedTask) => {
        toast.success("Task updated successfully");
        dispatch(updateTask(updatedTask));
        handleCloseModal();
      })
      .catch((err) => {
        setCreateError(err || "Failed to update task");
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
      <nav className="border-b border-[#e5e8ef] px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-40">
        {/* Logo: hidden on mobile, visible on desktop */}
        <div className="hidden sm:flex items-center">
          <span className="text-2xl font-extrabold tracking-tighter text-[#0f172a] cursor-pointer" onClick={() => router.push("/dashboard")}>
            Rival.io
          </span>
        </div>

        {/* User Details & Logout: User details left-aligned and logout right-aligned on mobile */}
        {user && (
          <div className="flex-1 sm:flex-none flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-xs sm:text-sm font-semibold text-[#0f172a] leading-none m-0">{user.name}</p>
                  {user.role && (
                    <Badge variant="brand" className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider !px-1.5 !py-0.5 shrink-0">
                      {user.role}
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-[#6b7890] mt-0.5 sm:mt-1 m-0 break-all">{user.email}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 sm:px-3.5 sm:py-1.5 border border-[#e5e8ef] hover:border-zinc-300 rounded-xl text-xs font-semibold text-[#3d4a66] hover:bg-zinc-50 transition-all cursor-pointer shrink-0"
              title="Logout"
            >
              <span className="hidden sm:inline">Logout</span>
              <svg className="block sm:hidden w-4.5 h-4.5 text-[#3d4a66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 pb-20 sm:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a]">Task Manager</h1>
            <p className="text-sm text-[#6b7890] mt-1">Manage, organize, and track your team's tasks.</p>
          </div>
          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            disabled={loading}
            className="p-2.5 border border-[#e5e8ef] hover:border-zinc-300 rounded-xl transition-all cursor-pointer text-[#3d4a66] hover:bg-zinc-50 shrink-0 flex items-center justify-center disabled:opacity-50"
            title="Refresh tasks"
          >
            <svg
              className={`w-5 h-5 ${loading ? "animate-spin text-[#2957ff]" : "text-[#3d4a66]"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
          </button>
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
        <TaskTable tasks={tasks} loading={loading} onTaskClick={handleTaskClick} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} currentUser={user} />

        {/* Pagination Controls */}
        {pagination && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </main>

      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        {createError && <div className="text-red-500 text-xs mb-3">{createError}</div>}
        <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="space-y-4">
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
          {editingTask && (
            <Select
              label="Status"
              value={status}
              onChange={setStatus}
              position="relative"
              options={[
                { value: "todo", label: "Todo" },
                { value: "in_progress", label: "In Progress" },
                { value: "done", label: "Done" },
              ]}
            />
          )}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 py-2 border border-[#e5e8ef] hover:bg-zinc-50 font-semibold rounded-xl text-sm transition-all cursor-pointer text-[#3d4a66]"
            >
              Cancel
            </button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              {editingTask ? "Save Changes" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedTask(null);
          setDetailError(null);
        }}
        title={selectedTask?.title || "Task Details"}
      >
        {selectedTask ? (
          <div className="space-y-6 text-left">
            {/* Task Info Grid */}
            <div className="grid grid-cols-3 gap-4 bg-[#fafbfd] border border-[#e5e8ef] p-4 rounded-2xl">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7890]">Status</span>
                <div className="flex">
                  <Badge variant={
                    selectedTask.status === "done" ? "success" :
                    selectedTask.status === "in_progress" ? "warning" : "neutral"
                  }>
                    {selectedTask.status ? String(selectedTask.status).replace("_", " ") : "todo"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7890]">Priority</span>
                <div className="flex">
                  <Badge variant={
                    selectedTask.priority === "high" ? "danger" :
                    selectedTask.priority === "medium" ? "warning" : "neutral"
                  }>
                    {selectedTask.priority || "medium"}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7890]">Due Date</span>
                <div className="flex items-center min-h-[26px]">
                  <span className="text-xs font-semibold text-[#0f172a] font-mono">
                    {selectedTask.due_date ? new Date(selectedTask.due_date).toLocaleDateString() : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-[#e5e8ef] pt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7890] block mb-2">Description</span>
              <p className="text-sm text-[#3d4a66] whitespace-pre-wrap leading-relaxed bg-[#fafbfd] border border-[#e5e8ef] rounded-2xl p-4 min-h-[100px]">
                {selectedTask.description || "No description provided."}
              </p>
            </div>

            {/* Timestamps */}
            {selectedTask.created_at && (
              <div className="border-t border-[#e5e8ef] pt-4 flex justify-between items-center text-[10px] text-[#6b7890] font-mono">
                <span>Created: {new Date(selectedTask.created_at).toLocaleString()}</span>
              </div>
            )}

            {/* History Accordion */}
            <div className="border-t border-[#e5e8ef] pt-4">
              <button
                type="button"
                onClick={toggleHistoryAccordion}
                className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#6b7890] hover:text-[#0f172a] transition-colors focus:outline-none cursor-pointer"
              >
                <span>Activity History</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isHistoryExpanded ? "rotate-180 text-[#0f172a]" : "text-[#6b7890]"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isHistoryExpanded && (
                <div className="mt-4 space-y-4 max-h-[300px] overflow-y-auto pr-1 animate-fade-in">
                  {loadingHistory ? (
                    // Beautiful loading skeletons
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="flex gap-3 animate-pulse">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 bg-zinc-200 rounded-full shrink-0 mt-1.5"></div>
                            {idx < 2 && <div className="w-0.5 h-12 bg-zinc-100 flex-1 my-1"></div>}
                          </div>
                          <div className="flex-1 space-y-2 pt-0.5">
                            <div className="h-3.5 bg-zinc-200 rounded w-1/4"></div>
                            <div className="h-3 bg-zinc-100 rounded w-3/4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : historyError ? (
                    <div className="text-xs text-red-500 py-2">{historyError}</div>
                  ) : history.length === 0 ? (
                    <div className="text-xs text-[#6b7890] py-2 text-center font-mono">No history logs recorded.</div>
                  ) : (
                    // Vertical timeline
                    <div className="relative pl-1 pb-2">
                      <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-[#e5e8ef]"></div>
                      <div className="space-y-6">
                        {history.map((log) => {
                          const logDate = new Date(log.createdAt).toLocaleString();
                          const isCreated = log.action === 'created';
                          const isDeleted = log.action === 'deleted';

                          return (
                            <div key={log.id} className="relative flex gap-4 text-xs">
                              {/* Timeline indicator node */}
                              <div className="z-10 flex items-center justify-center w-5 h-5 rounded-full bg-white border-2 shrink-0 select-none mt-0.5 transition-all"
                                   style={{
                                     borderColor: isCreated ? "#10b981" : isDeleted ? "#ef4444" : "#2957ff"
                                   }}
                              >
                                <div className="w-1.5 h-1.5 rounded-full"
                                     style={{
                                       backgroundColor: isCreated ? "#10b981" : isDeleted ? "#ef4444" : "#2957ff"
                                     }}
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-[#0f172a] capitalize">
                                    Task {log.action}
                                  </span>
                                  <span className="text-[10px] text-[#6b7890] font-mono shrink-0">
                                    {logDate}
                                  </span>
                                </div>
                                <p className="text-[#6b7890] mt-0.5 text-[11px]">
                                  Performer: <span className="font-medium text-[#3d4a66]">{log.user?.name || log.user?.email || "Unknown"}</span>
                                </p>

                                {/* Changes detail view if updated */}
                                {log.changes && Object.keys(log.changes).length > 0 && !isCreated && (
                                  <div className="mt-2 bg-[#fafbfd] border border-[#e5e8ef] rounded-xl p-2.5 space-y-1.5 text-[11px] font-mono">
                                    {Object.entries(log.changes).map(([field, delta]: [string, any]) => (
                                      <div key={field} className="flex flex-col sm:flex-row sm:items-start gap-1 leading-relaxed">
                                        <span className="font-semibold text-[#3d4a66] uppercase tracking-wider text-[9px] shrink-0 min-w-[70px] mt-0.5">
                                          {field.replace('_', ' ')}:
                                        </span>
                                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                          <span className="text-[#ef4444] bg-red-50 px-1 py-0.5 rounded border border-red-100 max-w-[120px] truncate" title={delta.old || "—"}>
                                            {delta.old || "—"}
                                          </span>
                                          <span className="text-[#6b7890] select-none">→</span>
                                          <span className="text-[#10b981] bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100 max-w-[120px] truncate" title={delta.new || "—"}>
                                            {delta.new || "—"}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions/Close */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedTask(null);
                }}
                className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-[#0f172a] font-semibold rounded-xl text-sm transition-all cursor-pointer text-center"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-[#2957ff]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTaskToDelete(null);
        }}
        title="Delete Task"
      >
        <div className="space-y-4 text-left">
          <p className="text-sm text-[#3d4a66]">
            Are you sure you want to delete the task <strong className="text-[#0f172a]">"{taskToDelete?.title}"</strong>? This action cannot be undone.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(false);
                setTaskToDelete(null);
              }}
              className="flex-1 py-2 border border-[#e5e8ef] hover:bg-zinc-50 font-semibold rounded-xl text-sm transition-all cursor-pointer text-[#3d4a66]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
