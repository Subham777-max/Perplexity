import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, fetchChats, fetchChatMessages, deleteChat } from "../services/chat.service";
import { setChats, setCurrentChatId, setLoading, setError ,createNewChat , addNewMessages , addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";


export function useChat(){
    const dispatch = useDispatch();

    async function handleSendMessage(chatId, message) {
        dispatch(setLoading(true));
        try{
            const data = await sendMessage(chatId, message);
            const { chat , message: aimessage } = data;
            dispatch(createNewChat({
                chatId: chat?._id || chatId,
                title: chat?.title,
            }));
            dispatch(addNewMessages({
                chatId: chat?._id || chatId,
                content: message,
                role: "user",
            }));
            dispatch(addNewMessages({
                chatId: chat?._id || chatId,
                content: aimessage.content ,
                role: aimessage.role,
            }));
            dispatch(setCurrentChatId(chat?._id || chatId));
        }catch(err){
            dispatch(setError(err.message));
        }finally{
            dispatch(setLoading(false));
        }
    }
    async function handleGetChats(){
        dispatch(setLoading(true));
        try{
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
        }catch(err){
            dispatch(setError(err.message));
        }finally{
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
                content: msg.content,
                role: msg.role,
            }));
            dispatch(addMessages({
                chatId,
                messages: formattedMessages,    
            }));
            
        }catch(err){
            dispatch(setError(err.message));
        }finally{
            dispatch(setLoading(false));

        }
    }
    return{
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
    }
}