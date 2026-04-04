import { generateResponse,generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res, next) {
    try{
        const { message , chat: chatId } = req.body;

        let chat = null , chatTitle = null;

        if(!chatId){
            chatTitle = await generateChatTitle(message);

            chat = await chatModel.create({
                user: req.user.id,
                title: chatTitle,
            });
        }

        const messageUser = await messageModel.create({
            chat: chatId || chat._id,
            role: "user",
            content: message,
        });

        const messages = await messageModel.find({ chat: chatId || chat._id }).sort({ createdAt: 1 });

        const result = await generateResponse(messages, false);

        const messageAi = await messageModel.create({
            chat: chatId || chat._id,
            role: "ai",
            content: result,
        });
        res.status(201).json({ 
            title: chatTitle , 
            chat , 
            message: messageAi
        });
    }catch(err){
        next(err);
    }
}


export async function getChats(req, res, next) {
    try{
        const chats = await chatModel.find({ user: req.user.id }).sort({ updatedAt: -1 });
        res.status(200).json({
            message: "Chats retrieved successfully",
            chats
        });
    }catch(err){
        next(err);
    }
}

export async function getChatMessages(req, res, next) {
    try{
        const { chatId } = req.params;
        const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
        if(!chat){
            return res.status(404).json({
                message: "Chat not found"
            });
        }
        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });
        res.status(200).json({
            message: "Messages retrieved successfully",
            messages
        });
    }catch(err){
        next(err);
    }
}
export async function deleteChat(req, res, next) {
    try{
        const { chatId } = req.params;
        const chat = await chatModel.findOneAndDelete({ _id: chatId, user: req.user.id });
        if(!chat){
            return res.status(404).json({
                message: "Chat not found"
            });
        }
        await messageModel.deleteMany({ chat: chatId });
        res.status(200).json({
            message: "Chat deleted successfully"
        });

    }catch(err){
        next(err);
    }
}