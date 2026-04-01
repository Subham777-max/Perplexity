import { Router } from 'express';
import { sendMessage } from '../controllers/chat.controller.js';
import { authUser } from '../middleware/auth.middleware.js';
const chatRouter = Router();

/**
 * @route POST /api/chats/message
 * @desc Send a message in the chat
 * @access Private
 */
chatRouter.post("/message", authUser, sendMessage);

export default chatRouter;