import { generateResponse,generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
export async function sendMessage(req, res, next) {
    try{
        const { message } = req.body;

        const chatTitle = await generateChatTitle(message);

        const result = await generateResponse(message);

        const chat = await chatModel.create({
            user: req.user.id,
            title: chatTitle,
        });
        
        const messageUser = await messageModel.create({
            chat: chat._id,
            role: "user",
            content: message,
        });
        const messageAi = await messageModel.create({
            chat: chat._id,
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

