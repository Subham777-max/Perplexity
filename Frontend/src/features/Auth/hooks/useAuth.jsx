import { useDispatch , useSelector } from "react-redux";
import { login,register,getMe } from "../services/auth.service";
import { setUser,setError,setLoading } from "../auth.slice";
import { useCallback } from "react";

export function useAuth() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const error = useSelector((state) => state.auth.error);
    const loading = useSelector((state) => state.auth.loading);

    async function handleRegister(username,email,password){
        try{
            dispatch(setLoading(true));
            const res = await register(username,email,password);
            dispatch(setUser(res.data));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin(identifier,password){
        try{
            dispatch(setLoading(true));
            const res = await login(identifier,password);
            dispatch(setUser(res.data));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleGetMe = useCallback(async()=>{
        try{
            const res = await getMe();
            dispatch(setUser(res.data));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    },[dispatch]);

    return { handleRegister, handleLogin, handleGetMe, user, error, loading };
} 