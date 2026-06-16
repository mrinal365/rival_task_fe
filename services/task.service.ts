import api from "@/services/api";

export const getAllTasksService = (params?: { search?: string; sortBy?: string; order?: string; page?: number; limit?: number }) => {
  return api
    .get("/tasks", { params: params || {} })
    .then((res) => {
      const data = res.data?.data || res.data;
      return data;
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

export const getTaskByIdService = (id: string) => {
  return api
    .get(`/tasks/${id}`)
    .then((res) => {
      const data = res.data;
      const task = data?.data?.task || data?.task || data?.data || data;
      return task;
    })
    .catch((err) => {
      const message = err?.response?.data?.message || "Something went wrong";
      return Promise.reject(message);
    });
};

export const updateTaskService = (id: string, payload: { title?: string; description?: string; due_date?: string; priority?: string; status?: string }) => {
  return api
    .patch(`/tasks/${id}`, payload)
    .then((res) => {
      const data = res.data;
      const updatedTask = data?.data?.task || data?.task || data?.data || data;
      return updatedTask;
    })
    .catch((err) => {
      const message = err?.response?.data?.message || "Something went wrong";
      return Promise.reject(message);
    });
};

export const deleteTaskService = (id: string) => {
  return api
    .delete(`/tasks/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const message = err?.response?.data?.message || "Something went wrong";
      return Promise.reject(message);
    });
};

export const getTaskHistoryService = (id: string) => {
  return api
    .get(`/tasks/${id}/history`)
    .then((res) => {
      const data = res.data;
      const history = data?.data || data;
      return history;
    })
    .catch((err) => {
      const message = err?.response?.data?.message || "Something went wrong";
      return Promise.reject(message);
    });
};
