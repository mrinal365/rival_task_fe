import api from "@/services/api";

export const getAllTasksService = (params?: { search?: string; sortBy?: string; order?: string }) => {
  return api
    .get("/tasks", { params: params || {} })
    .then((res) => {
      const data = res.data;
      return data?.data?.tasks || data?.tasks || data || [];
    })
    .catch((err) => {
      const message = err?.response?.data?.message || "Something went wrong";
      return Promise.reject(message);
    });
};

export const createTaskService = (payload: { title: string; description?: string; due_date?: string; priority?: string }) => {
  return api
    .post("/tasks", payload)
    .then((res) => {
      const data = res.data;
      const newTask = data?.data?.task || data?.task || data?.data || data;
      return newTask;
    })
    .catch((err) => {
      const message = err?.response?.data?.message || "Something went wrong";
      return Promise.reject(message);
    });
};
