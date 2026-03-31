import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-theme-gradient">
      <div className="w-full max-w-md p-8 space-y-6 bg-primary rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-primary leading-1">
          Create Your Account
        </h2>
        <p className="text-center text-secondary">
          Join us and start your journey.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
          />
          <Input
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <Input
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
          />
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-custom-primary cursor-pointer rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-primary"
            >
              Register
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-custom-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
