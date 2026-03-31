import { createBrowserRouter } from 'react-router-dom'
import Login from '../features/Auth/pages/Login'
import Register from '../features/Auth/pages/Register'
import ProtectedRoutes from '../utils/ProtectedRoutes'
import Dashboard from '../features/Chat/pages/Dashboard'
export const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoutes><Dashboard /></ProtectedRoutes>
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
])