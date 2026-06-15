import api from "@/services/api";

export const getAllTasksService = () => {
  return api
    .get("/tasks")
    .then((res) => res.data)
    .catch((err) => {
      const message = err?.response?.data?.message || "Something went wrong";
      return Promise.reject(message);
    });
};

export const createTaskService = (payload: { title: string; description?: string }) => {
  return api
    .post("/tasks", payload)
    .then((res) => res.data)
    .catch((err) => {
      const message = err?.response?.data?.message || "Something went wrong";
      return Promise.reject(message);
    });
};
