import { Server } from "socket.io";
import { verifyToken } from "../middleware/auth.middleware.js";
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

                if(!socket.userId){
                    return callback({ success: false, message: "Unauthorized" });
                }
                let chatTitle = null;
                let chat = null;

                if(!chatId){
                    chatTitle = await generateChatTitle(message);
                    chat = await chatModel.create({
                        user: socket.userId,
                        title: chatTitle,
                    });
                }

                const messageUser = await messageModel.create({
                    chat: chatId || chat._id,
                    role: "user",
                    content: message,
                });
                callback({ success: true, message: messageUser });

                io.to(`user_${socket.userId}`).emit("message:user-added", {
                    messageId: messageUser._id,
                    chatId: chatId || chat._id,
                    content: message,
                    role: "user",
                    createdAt: messageUser.createdAt,
                });

                const messages = await messageModel.find({ chat: chatId || chat._id }).sort({ createdAt: 1 });

                const aiMessage = await messageModel.create({
                    chat: chatId || chat._id,
                    role: "ai",
                    content: "",
                });

                await streamAiResponse(socket, socket.userId, chatId || chat._id, aiMessage._id, messages, chatTitle);

            }catch(err){
                console.error("Error handling user message:", err);
                callback({ success: false, message: err.message });
            }
        })
    });
}

async function streamAiResponse(socket, userId, chatId, messageId, messages, chatTitle) {
    try{
        const aiResponseStream = await generateResponse(messages, true);

        let fullResponse = "";

        // listen to the stream and emit chunks to the client
        for await (const chunk of aiResponseStream){
            fullResponse += chunk;

            // Emit the chunk to the specific user
            io.to(`user_${userId}`).emit("ai:streaming", {
                messageId: messageId.toString(),
                chatId: chatId.toString(),
                chunk,
                fullText: fullResponse,
            })
        }

        // Update the message in the database with the full response once streaming is done
        const updatedMessage = await messageModel.findByIdAndUpdate(
            messageId,
            { content: fullResponse },
            { returnDocument: "after" }
        );

        // Emit complete message to the client
        io.to(`user_${userId}`).emit("ai:message-complete", {
            messageId: messageId.toString(),
            chatId: chatId.toString(),
            content: fullResponse,
            createdAt: updatedMessage.createdAt,
            ...(chatTitle && { chatTitle }),
        });
    }catch(err){
        console.error("Error streaming AI response:", err);
        io.to(`user_${userId}`).emit("ai:error", {
            messageId: messageId.toString(),
            chatId: chatId.toString(),
            error: "Failed to generate AI response",
        });
    }
}
export function getIo(){
    if(!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}