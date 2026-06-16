import api from "@/services/api";

export const loginService = (payload: { email: string; password: string }) => {
    return api
        .post("/auth/login", payload)
        .then((res) => res.data)
        .catch((err) => {
            const message = err?.response?.data?.message || "Something went wrong";
            return Promise.reject(message);
        });
};

export const getMeService = () => {
    return api
        .get("/auth/me")
        .then((res) => {
            const data = res.data;
            const finalUser = data?.data
            return finalUser;
        })
        .catch((err) => {
            const message = err?.response?.data?.message || "Something went wrong";
            return Promise.reject(message);
        });
};

export const signupService = (payload: { name: string; email: string; password: string }) => {
    return api
        .post("/auth/signup", payload)
        .then((res) => res.data)
        .catch((err) => {
            const message = err?.response?.data?.message || "Something went wrong";
            return Promise.reject(message);
        });
};
