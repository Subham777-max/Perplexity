import api from "../../API/api.js";

export async function login(identifier, password) {
    const res = await api.post("/auth/login", { identifier, password });
    return res.data;
}

export async function register(username, email, password) {
    const res = await api.post("/auth/register", { username, email, password });
    return res.data;
}

export async function getMe(){
    const res = await api.get("/auth/me");
    return res.data;
}