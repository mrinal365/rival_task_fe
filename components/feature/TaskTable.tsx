import React from "react";
import Badge from "@/components/common/Badge";
import { Task } from "@/store/task.slice";

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, loading }) => {
  const getStatusVariant = (status?: string) => {
    switch (status) {
      case "done":
        return "success";
      case "in_progress":
        return "warning";
      default:
        return "neutral";
    }
  };

  return (
    <>
      {/* Desktop View  */}
      <div className="hidden md:block border border-[#e5e8ef] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(10,21,48,0.03)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#fafbfd] border-b border-[#e5e8ef] text-[#3d4a66] font-semibold">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Priority</th>
                <th className="p-4 font-semibold">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e8ef]">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4">
                      <div className="h-4 bg-zinc-200 rounded-md w-2/3"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-zinc-100 rounded-md w-5/6"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-zinc-200 rounded-full w-16"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-zinc-100 rounded-md w-12"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-zinc-200 rounded-md w-20"></div>
                    </td>
                  </tr>
                ))
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#6b7890] font-mono">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-[#fafbfd]/50 transition-colors">
                    <td className="p-4 font-semibold text-[#0f172a]">{task.title}</td>
                    <td className="p-4 text-[#6b7890] max-w-xs truncate">{task.description || "—"}</td>
                    <td className="p-4">
                      <Badge variant={getStatusVariant(task.status)}>
                        {task.status ? String(task.status).replace("_", " ") : "todo"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-zinc-700 font-medium">{task.priority || "medium"}</span>
                    </td>
                    <td className="p-4 text-[#6b7890] font-mono text-xs">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet View  */}
      <div className="block md:hidden">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#e5e8ef] p-5 rounded-2xl shadow-[0_1px_2px_rgba(10,21,48,0.02)] space-y-4 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-zinc-200 rounded w-1/2"></div>
                  <div className="h-5 bg-zinc-200 rounded-full w-14"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 bg-zinc-100 rounded w-5/6"></div>
                  <div className="h-3.5 bg-zinc-100 rounded w-2/3"></div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-zinc-50">
                  <div className="h-4 bg-zinc-100 rounded w-16"></div>
                  <div className="h-4 bg-zinc-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white border border-[#e5e8ef] p-8 rounded-2xl text-center text-[#6b7890] font-mono shadow-[0_1px_2px_rgba(10,21,48,0.02)]">
            No tasks found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white border border-[#e5e8ef] hover:border-zinc-300 transition-all p-5 rounded-2xl shadow-[0_1px_2px_rgba(10,21,48,0.02)] flex flex-col justify-between min-h-[160px]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4.5 h-4.5 text-[#2957ff] shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <h4 className="font-bold text-[#0f172a] text-sm line-clamp-1">{task.title}</h4>
                    </div>
                    <Badge variant={getStatusVariant(task.status)} className="shrink-0 text-[10px] px-2 py-0.5">
                      {task.status ? String(task.status).replace("_", " ") : "todo"}
                    </Badge>
                  </div>

                  <p className="text-[#6b7890] text-xs mt-2.5 line-clamp-2 leading-relaxed">
                    {task.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between border-t border-[#e5e8ef]/50 text-xs">
                  {/* Priority */}
                  <div className="flex items-center gap-1.5 text-zinc-700 font-medium">
                    <svg
                      className="w-3.5 h-3.5 text-[#6b7890]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                      />
                    </svg>
                    <span className="capitalize">{task.priority || "medium"}</span>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center gap-1.5 text-[#6b7890] font-mono">
                    <svg
                      className="w-3.5 h-3.5 text-[#6b7890]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{task.due_date ? new Date(task.due_date).toLocaleDateString() : "—"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TaskTable;
