import { io } from "socket.io-client";
import { store } from "../../../app/app.store.js";
import { 
    addNewMessages, 
    createNewChat,
    setStreamingMessage,
    completeMessage,
    setError,
    setLoading
} from "../chat.slice.js";

let socket = null;
let isAuthenticated = false;
let isInitializing = false;

// Helper function to get token from cookies
function getTokenFromCookies() {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let cookie of cookieArray) {
        cookie = cookie.trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length);
        }
    }
    return null;
}

export function initializeSocketConnection() {
    // Prevent multiple initialization calls
    if (isInitializing) {
        console.log("Socket initialization already in progress");
        return socket;
    }

    // If socket is already connected and authenticated, don't reinitialize
    if (socket && isAuthenticated) {
        console.log("Socket already connected and authenticated");
        return socket;
    }

    // If socket exists but is not authenticated, wait for authentication
    if (socket && socket.connected && !isAuthenticated) {
        console.log("Socket connected, waiting for authentication");
        return socket;
    }

    // Only create a new socket if one doesn't exist
    if (socket) {
        console.log("Socket exists but disconnected, reusing...");
        return socket;
    }

    isInitializing = true;

    // Get token from cookies
    const authToken = getTokenFromCookies();
    
    if (!authToken) {
        console.error("No authentication token found in cookies");
        store.dispatch(setError("Authentication token not found. Please login again."));
        isInitializing = false;
        return null;
    }

    socket = io("http://localhost:3000", {
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        auth: {
            token: authToken,
        }
    });

    socket.on("connect", () => {
        console.log("Socket connected with id: " + socket.id);
        
        // Authenticate socket after connection
        socket.emit("authenticate", authToken, (response) => {
            if (response.success) {
                console.log("Socket authenticated successfully");
                isAuthenticated = true;
            } else {
                console.error("Socket authentication failed:", response.error);
                isAuthenticated = false;
                store.dispatch(setError("Socket authentication failed"));
            }
        });
    });

    // Listen for user message confirmation
    socket.on("message:user-added", (data) => {
        const { messageId, chatId, content, role, createdAt } = data;
        console.log("User message added:", messageId);
        
        store.dispatch(addNewMessages({
            chatId,
            content,
            role,
            id: messageId,
            createdAt,
            isStreaming: false,
        }));
    });

    // Listen for AI streaming chunks - shows typing effect
    socket.on("ai:streaming", (data) => {
        const { messageId, chatId, chunk, fullText } = data;
        console.log("Streaming chunk received:", { messageId, chunkLength: chunk.length });
        
        // Stop showing "Searching..." when streaming starts
        store.dispatch(setLoading(false));
        
        // Update Redux with streaming text
        store.dispatch(setStreamingMessage({
            chatId,
            messageId,
            chunk, // new chunk
            fullText, // accumulated text so far
        }));
    });

    // Listen for AI message completion
    socket.on("ai:message-complete", (data) => {
        const { messageId, chatId, content, createdAt, chatTitle } = data;
        console.log("AI message complete:", messageId);
        
        // Mark message as complete (stop streaming animation)
        store.dispatch(completeMessage({
            chatId,
            messageId,
        }));

        // If new chat, update chat title
        if (chatTitle) {
            store.dispatch(createNewChat({
                chatId,
                title: chatTitle,
            }));
        }
    });

    // Listen for errors from server
    socket.on("ai:error", (data) => {
        const { chatId, error } = data;
        console.error("AI Error from server:", error);
        store.dispatch(setError(error));
        store.dispatch(setLoading(false));
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
        isAuthenticated = false;
    });

    socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        isAuthenticated = false;
        store.dispatch(setError("Connection error: " + error.message));
    });

    isInitializing = false;
    return socket;
}

export function getSocket() {
    return socket;
}

export function isSocketConnected() {
    return socket?.connected && isAuthenticated;
}

export function sendMessageViaSocket(chatId, message) {
    return new Promise((resolve, reject) => {
        // Check connection
        if (!socket) {
            reject(new Error("Socket not initialized. Please refresh the page."));
            return;
        }

        if (!socket.connected) {
            reject(new Error("Socket not connected. Connecting..."));
            return;
        }

        if (!isAuthenticated) {
            reject(new Error("Socket not authenticated. Please refresh the page."));
            return;
        }

        // Set a timeout for the response (5 seconds)
        const timeoutId = setTimeout(() => {
            reject(new Error("No response from server. Please try again."));
        }, 5000);

        // Emit user:message event to backend
        socket.emit("user:message", { 
            chatId, 
            message 
        }, (response) => {
            clearTimeout(timeoutId);
            
            // Check if response exists
            if (!response) {
                console.error("No response received from server");
                reject(new Error("No response from server"));
                return;
            }

            // Check if response has success property
            if (response.success === undefined) {
                console.error("Invalid response format:", response);
                reject(new Error("Invalid response from server"));
                return;
            }

            if (response.success) {
                console.log("Message sent successfully:", response.messageId);
                resolve({
                    messageId: response.messageId,
                    chatId: response.chatId,
                });
            } else {
                console.error("Server error:", response.error);
                reject(new Error(response.error || "Failed to send message"));
            }
        });
    });
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
        isAuthenticated = false;
        console.log("Socket disconnected and cleared");
    }
}