import { initializeSocketConnection, sendMessageViaSocket, disconnectSocket, isSocketConnected } from "../services/chat.socket";
import { sendMessage, fetchChats, fetchChatMessages, deleteChat } from "../services/chat.service";
import { 
    setChats, 
    setCurrentChatId, 
    setLoading, 
    setError, 
    createNewChat, 
    addNewMessages, 
    addMessages
} from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/hooks/useAuth";

export function useChat(){
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [isSocketReady, setIsSocketReady] = useState(false);

    // Initialize socket connection on mount when user is authenticated
    useEffect(() => {
        if (user) {
            console.log("User authenticated, initializing socket connection");
            initializeSocketConnection();
            
            // Check socket status periodically for first 5 seconds
            const checkInterval = setInterval(() => {
                if (isSocketConnected()) {
                    console.log("Socket is ready!");
                    setIsSocketReady(true);
                    clearInterval(checkInterval);
                }
            }, 500);

            // Clear interval after 5 seconds
            const timeout = setTimeout(() => {
                clearInterval(checkInterval);
            }, 5000);

            return () => {
                clearInterval(checkInterval);
                clearTimeout(timeout);
            };
        }
    }, [user]);

    // Cleanup socket on unmount or user logout
    useEffect(() => {
        return () => {
            if (!user) {
                disconnectSocket();
            }
        };
    }, [user]);

    async function handleSendMessage(chatId, message) {
        dispatch(setLoading(true));
        dispatch(setError(null));
        
        try {
            console.log("handleSendMessage called:", { chatId, message, isConnected: isSocketConnected() });
            
            // Check socket connection before sending
            if (!isSocketConnected()) {
                throw new Error("Socket is not connected. Please wait a moment and try again.");
            }

            // Send message via Socket.io (real-time with streaming)
            console.log("Sending message via socket:", { chatId, message });
            const { messageId, chatId: responseChatId } = await sendMessageViaSocket(chatId, message);
            
            console.log("Message accepted by server:", { messageId, responseChatId });
            
            // IMPORTANT: Update current chat ID immediately if this is a new chat
            // This ensures the UI updates to show the new chat before streaming events arrive
            if (!chatId) {
                console.log("New chat created, setting currentChatId:", responseChatId);
                dispatch(setCurrentChatId(responseChatId));
                
                // Also create the chat in Redux if it doesn't exist
                dispatch(createNewChat({
                    chatId: responseChatId,
                    title: "Loading...", // Will be updated when we receive chatTitle from streaming completion
                }));
            }
            
            // Socket listeners will handle:
            // 1. "message:user-added" - adds user message to chat
            // 2. "ai:streaming" - updates AI message in real-time with typing effect
            // 3. "ai:message-complete" - finalizes AI message and updates chat title
            
        } catch (err) {
            console.error("Send message error:", err.message, err);
            const errorMsg = err.message || "Failed to send message";
            dispatch(setError(errorMsg));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetChats(){
        dispatch(setLoading(true));
        try {
            const data = await fetchChats();
            const { chats } = data;
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                };
                return acc;
            }, {})));
        } catch(err){
            console.error("Get chats error:", err);
            dispatch(setError(err.message));
        } finally{
            dispatch(setLoading(false));
        }
    }

    async function handleOpenChat(chatId){
        dispatch(setLoading(true));
        try{
            dispatch(setCurrentChatId(chatId));
            const data = await fetchChatMessages(chatId);
            const { messages } = data;
            const formattedMessages = messages.map(msg => ({
                id: msg._id,
                content: msg.content,
                role: msg.role,
                createdAt: msg.createdAt,
                isStreaming: false,
            }));
            dispatch(addMessages({
                chatId,
                messages: formattedMessages,    
            }));
            
        } catch(err){
            console.error("Open chat error:", err);
            dispatch(setError(err.message));
        } finally{
            dispatch(setLoading(false));
        }
    }

    return{
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        isSocketReady,
    }
}