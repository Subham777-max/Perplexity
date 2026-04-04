import { Server } from "socket.io";
import { verifyToken } from "../middleware/auth.middleware.js";
import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

let io;

export function initSocket(httpserver){
    io = new Server(httpserver,{
        cors:{
            origin: "http://localhost:5173",
            credentials: true,
        }
    });

    console.log("Socket io server is running");
    
    io.on("connection", (socket)=>{
        console.log("A user connected: " + socket.id);

        // Midddleware to check authentication
        socket.on("authenticate", (token,callback)=>{
            try{
                const decoded = verifyToken(token);
                socket.userId = decoded.id;
                socket.join(`user_${decoded.id}`);
                callback({ success: true });
            }catch(err){
                callback({ success: false, message: err.message });
            }
        })

        // Listen for user messages
        socket.on("user:message", async (data,callback)=>{
            try{
                const { message , chatId } = data;
                console.log("Received user:message event:", { chatId, messageLength: message?.length, userId: socket.userId });

                if(!socket.userId){
                    return callback({ success: false, message: "Unauthorized" });
                }
                let chatTitle = null;
                let chat = null;

                if(!chatId){
                    console.log("New chat - generating title");
                    chatTitle = await generateChatTitle(message);
                    chat = await chatModel.create({
                        user: socket.userId,
                        title: chatTitle,
                    });
                    console.log("Chat created:", { chatId: chat._id, title: chatTitle });
                }

                const messageUser = await messageModel.create({
                    chat: chatId || chat._id,
                    role: "user",
                    content: message,
                });
                
                console.log("User message saved:", { messageId: messageUser._id });
                
                // Call callback with proper response format
                callback({ 
                    success: true, 
                    messageId: messageUser._id,
                    chatId: chatId || chat._id
                });

                io.to(`user_${socket.userId}`).emit("message:user-added", {
                    messageId: messageUser._id,
                    chatId: chatId || chat._id,
                    content: message,
                    role: "user",
                    createdAt: messageUser.createdAt,
                });

                const messages = await messageModel.find({ chat: chatId || chat._id }).sort({ createdAt: 1 });
                console.log("Fetched conversation history:", { count: messages.length });

                const aiMessage = await messageModel.create({
                    chat: chatId || chat._id,
                    role: "ai",
                    content: "...", // Placeholder - will be updated as streaming progresses
                });
                
                console.log("AI message placeholder created:", { messageId: aiMessage._id });

                // Start streaming in the background (don't wait)
                streamAiResponse(socket, socket.userId, chatId || chat._id, aiMessage._id, messages, chatTitle).catch(err => {
                    console.error("Unhandled error in streamAiResponse:", err);
                });

            }catch(err){
                console.error("Error handling user message:", err);
                callback({ success: false, message: err.message });
            }
        })
    });
}

async function streamAiResponse(socket, userId, chatId, messageId, messages, chatTitle) {
    try{
        console.log("Starting AI response with agent tools...");
        const fullResponse = await generateResponse(messages, true);

        console.log("✅ Agent completed, response length:", fullResponse.length);

        if (!fullResponse || fullResponse.trim() === "") {
            console.warn("❌ No response content received from AI");
            const fallbackResponse = "I apologize, but I couldn't generate a proper response. Please try again.";
            
            // Stream the fallback character by character
            for (let i = 0; i < fallbackResponse.length; i++) {
                const chunk = fallbackResponse[i];
                const accumulator = fallbackResponse.substring(0, i + 1);
                
                io.to(`user_${userId}`).emit("ai:streaming", {
                    messageId: messageId.toString(),
                    chatId: chatId.toString(),
                    chunk: chunk,
                    fullText: accumulator,
                });
            }
            
            // Update DB and emit completion
            await messageModel.findByIdAndUpdate(
                messageId,
                { content: fallbackResponse },
                { returnDocument: "after" }
            );
            
            io.to(`user_${userId}`).emit("ai:message-complete", {
                messageId: messageId.toString(),
                chatId: chatId.toString(),
                content: fallbackResponse,
                ...(chatTitle && { chatTitle }),
            });
            return;
        }

        // Stream the response character by character for typing effect
        console.log("📤 Streaming response character by character...");
        for (let i = 0; i < fullResponse.length; i++) {
            const chunk = fullResponse[i];
            const accumulator = fullResponse.substring(0, i + 1);
            
            if (i % 50 === 0) { // Log every 50 characters to avoid spam
                console.log(`✅ Streamed ${i}/${fullResponse.length} characters`);
            }
            
            io.to(`user_${userId}`).emit("ai:streaming", {
                messageId: messageId.toString(),
                chatId: chatId.toString(),
                chunk: chunk,
                fullText: accumulator,
            });
        }

        console.log("✅ Streaming complete. Total length:", fullResponse.length);

        // Update the message in the database with the full response
        const updatedMessage = await messageModel.findByIdAndUpdate(
            messageId,
            { content: fullResponse },
            { returnDocument: "after" }
        );

        console.log("✅ Message updated in database");

        // Emit complete message to the client
        io.to(`user_${userId}`).emit("ai:message-complete", {
            messageId: messageId.toString(),
            chatId: chatId.toString(),
            content: fullResponse,
            createdAt: updatedMessage.createdAt,
            ...(chatTitle && { chatTitle }),
        });
        
        console.log("✅ Completion event emitted to user");
    }catch(err){
        console.error("❌ Error streaming AI response:", err.message);
        io.to(`user_${userId}`).emit("ai:error", {
            chatId: chatId.toString(),
            error: err.message || "Failed to generate AI response",
        });
    }
}
export function getIo(){
    if(!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}