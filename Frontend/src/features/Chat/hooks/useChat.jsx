import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, fetchChats, fetchChatMessages, deleteChat } from "../services/chat.service";
export function useChat(){

    return{
        initializeSocketConnection,
    }
}