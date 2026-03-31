import { createBrowserRouter } from 'react-router-dom'
import Login from '../features/Auth/pages/Login'
import Register from '../features/Auth/pages/Register'
import ProtectedRoutes from '../utils/ProtectedRoutes'
export const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoutes><p>Home</p></ProtectedRoutes>
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