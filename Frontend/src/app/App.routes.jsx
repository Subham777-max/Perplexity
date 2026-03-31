import { createBrowserRouter } from 'react-router-dom'
import Login from '../features/Auth/pages/Login'
import Register from '../features/Auth/pages/Register'
export const router = createBrowserRouter([
    {
        path: '/',
        element: <p>Home</p>
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