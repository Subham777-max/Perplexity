import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, fetchChats, fetchChatMessages, deleteChat } from "../services/chat.service";
import { setChats, setCurrentChatId, setLoading, setError ,createNewChat , addNewMessages } from "../chat.slice";
import { useDispatch } from "react-redux";


export function useChat(){
    const dispatch = useDispatch();

    async function handleSendMessage(chatId, message) {
        dispatch(setLoading(true));
        try{
            const data = await sendMessage(chatId, message);
            const { chat , message: aimessage } = data;
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title,
            }));
            dispatch(addNewMessages({
                chatId: chat._id,
                content: message,
                role: "user",
            }));
            dispatch(addNewMessages({
                chatId: chat._id,
                content: aimessage.content ,
                role: aimessage.role,
            }));
            dispatch(setCurrentChatId(chat?._id));
        }catch(err){
            dispatch(setError(err.message));
        }finally{
            dispatch(setLoading(false));
        }
    }
    return{
        initializeSocketConnection,
        handleSendMessage,
    }
}