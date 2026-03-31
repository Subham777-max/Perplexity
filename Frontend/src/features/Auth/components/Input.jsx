import React from "react";

const Input = ({ type = "text", label, name, value, onChange, placeholder }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-primary">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 bg-tertiary border border-theme rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D97757] focus:border-[#D97757] sm:text-sm"
      />
    </div>
  );
};

export default Input;
