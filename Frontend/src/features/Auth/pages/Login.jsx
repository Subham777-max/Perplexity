import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { handleLogin , loading , user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    await handleLogin(formData.identifier, formData.password);
    navigate("/");
  };

  if(!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-theme-gradient">
      <div className="w-full max-w-md p-8 space-y-6 bg-primary rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-primary leading-1">
          Welcome Back
        </h2>
        <p className="text-center text-secondary">
          Sign in to continue your journey.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email or Username"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Enter your email or username"
          />
          <Input
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-custom-primary rounded-md cursor-pointer hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-primary"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-secondary">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-custom-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
