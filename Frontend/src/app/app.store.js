import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/auth.slice";
import chatReducer from "../features/Chat/chat.slice";
import themeReducer from "./theme.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    theme: themeReducer,
  },
});