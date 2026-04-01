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

        const result = await generateResponse(messages);

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

