import api from "../../API/api";

export async function sendMessage(chatId, message) {
    const res = await api.post("/chats/message", { chatId, message });
    return res.data;
}

export async function fetchChats() {
    const res = await api.get("/chats");
    return res.data;
}

export async function fetchChatMessages(chatId) {
    const res = await api.get(`/chats/${chatId}/messages`);
    return res.data;
}

export async function deleteChat(chatId) {
    const res = await api.post(`/chats/delete/${chatId}`);
    return res.data;
}