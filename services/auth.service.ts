import api from "@/services/api";
import { store } from "@/store";
import { setUser } from "@/store/auth.slice";

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
            const finalUser = data?.data || data?.user || data;
            store.dispatch(setUser(finalUser));
            return data;
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
