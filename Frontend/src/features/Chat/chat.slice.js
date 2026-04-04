import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState:{
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        createNewChat:(state, action) => {
            const { chatId , title } = action.payload;
            // Only create if it doesn't exist, or only update title if it does
            if (!state.chats[chatId]) {
                state.chats[chatId] = { 
                    id: chatId, 
                    title, 
                    messages: [],
                    lastUpdated: new Date().toISOString(),
                };
            } else {
                // If chat already exists, just update the title (don't reset messages!)
                state.chats[chatId].title = title;
                state.chats[chatId].lastUpdated = new Date().toISOString();
            }
        },
        addNewMessages: (state, action) => {
            const { chatId, content , role , lastUpdated, id, createdAt, isStreaming } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages.push({ 
                    id,
                    content, 
                    role,
                    createdAt: createdAt || new Date().toISOString(),
                    isStreaming: isStreaming || false,
                });
                state.chats[chatId].lastUpdated = lastUpdated || new Date().toISOString();
            }
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages = messages;
            }
        },
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        // New reducer for handling streaming chunks
        setStreamingMessage: (state, action) => {
            const { chatId, messageId, fullText, chunk } = action.payload;
            
            // Create chat if it doesn't exist
            if (!state.chats[chatId]) {
                console.warn("Chat doesn't exist in Redux, creating it:", chatId);
                state.chats[chatId] = {
                    id: chatId,
                    title: "New Chat",
                    messages: [],
                    lastUpdated: new Date().toISOString(),
                };
            }
            
            if (state.chats[chatId]) {
                const messages = state.chats[chatId].messages;
                const msgIndex = messages.findIndex(m => m.id === messageId);
                
                if (msgIndex !== -1) {
                    // Update existing message with accumulated text
                    messages[msgIndex].content = fullText;
                    messages[msgIndex].isStreaming = true;
                } else {
                    // Create new AI message if doesn't exist
                    messages.push({
                        id: messageId,
                        role: "ai",
                        content: fullText,
                        isStreaming: true,
                        createdAt: new Date().toISOString(),
                    });
                }
            }
        },

        // Helper to mark message as complete (stop streaming animation)
        completeMessage: (state, action) => {
            const { chatId, messageId } = action.payload;
            
            if (state.chats[chatId]) {
                const msgIndex = state.chats[chatId].messages.findIndex(m => m.id === messageId);
                if (msgIndex !== -1) {
                    state.chats[chatId].messages[msgIndex].isStreaming = false;
                }
            }
        },
    }
})

export const { 
    setChats, 
    setCurrentChatId, 
    setLoading, 
    setError, 
    createNewChat, 
    addNewMessages, 
    addMessages,
    setStreamingMessage,
    completeMessage
} = chatSlice.actions;
export default chatSlice.reducer;