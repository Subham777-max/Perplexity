import { initializeSocketConnection } from "../services/chat.socket";

export function useChat(){

    return{
        initializeSocketConnection,
    }
}