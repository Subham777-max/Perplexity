import { RouterProvider } from "react-router-dom"
import { router } from "./App.routes"
import { useAuth } from "../features/Auth/hooks/useAuth"
import { useTheme } from "../features/Theme/hooks/useTheme"
import { useEffect } from "react";

function App() {
    const { loading , handleGetMe } = useAuth();
    const { theme } = useTheme();

    // Initialize and apply theme on app load and when theme changes
    useEffect(() => {
      const body = document.body;
      body.classList.remove('light', 'dark');
      body.classList.add(theme);
    }, [theme]);

    useEffect(()=>{
      handleGetMe();
    }, [handleGetMe]);

    if(loading) {
      return null;
    }
    return (
      <>
        <RouterProvider router={router} />
      </>
    )
}

export default App