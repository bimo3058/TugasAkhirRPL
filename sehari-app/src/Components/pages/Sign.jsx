import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import mount from "../images/fixbg.jpg";

const Newlogin = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        console.error("Failed to parse JSON:", err);
      }

      if (!res.ok) {
        const message =
          data?.message || `Sign up failed with status ${res.status}`;
        console.error("Server response:", data);
        alert("Sign up failed: " + message);
        return;
      }

      navigate("/");
    } catch (error) {
      console.error("Network error:", error);
      alert("Error connecting to server: " + error.message);
    }
  };

  const handleSign = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-2.5 bg-gradient-to-br from-pink-300 via-pink-200 to-orange-200 relative font-sans">
      <img
        className="absolute w-full h-full object-cover"
        alt="bg"
        src={mount}
      />

      <div className="w-[480px] rounded-2xl p-10 text-center bg-white/10 border border-white/20 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-300 ease-in-out relative z-20 hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)]">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <h3 className="opacity-50 text-white text-left mb-2">
            Please enter your details
          </h3>
          <h2 className="text-4xl mb-6 text-white tracking-wide font-bold text-left">
            Welcome Back!
          </h2>

          {/* Username input field */}
          <div className="relative border-b-2 border-white/30 my-5 group">
            <input
              name="username"
              type="text"
              autoComplete="off"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full h-10 bg-transparent border-none outline-none text-base text-white px-2.5 peer"
            />
            <label className="absolute top-1/2 left-0 -translate-y-1/2 text-white text-base pointer-events-none transition-all duration-300 ease-in-out peer-focus:text-sm peer-focus:top-2.5 peer-focus:-translate-y-[150%] peer-focus:text-purple-900 peer-valid:text-sm peer-valid:top-2.5 peer-valid:-translate-y-[150%] peer-valid:text-purple-900">
              Enter your username
            </label>
          </div>

          {/* Email input field */}
          <div className="relative border-b-2 border-white/30 my-5 group">
            <input
              name="email"
              type="text"
              required
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-10 bg-transparent border-none outline-none text-base text-white px-2.5 peer"
            />
            <label className="absolute top-1/2 left-0 -translate-y-1/2 text-white text-base pointer-events-none transition-all duration-300 ease-in-out peer-focus:text-sm peer-focus:top-2.5 peer-focus:-translate-y-[150%] peer-focus:text-purple-900 peer-valid:text-sm peer-valid:top-2.5 peer-valid:-translate-y-[150%] peer-valid:text-purple-900">
              Enter your email
            </label>
          </div>

          {/* Password input field */}
          <div className="relative border-b-2 border-white/30 my-5 group flex">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              value={formData.password}
              required
              onChange={handleChange}
              className="w-full h-10 bg-transparent border-none outline-none text-base text-white px-2.5 peer"
            />
            <label className="absolute top-1/2 left-0 -translate-y-1/2 text-white text-base pointer-events-none transition-all duration-300 ease-in-out peer-focus:text-sm peer-focus:top-2.5 peer-focus:-translate-y-[150%] peer-focus:text-purple-900 peer-valid:text-sm peer-valid:top-2.5 peer-valid:-translate-y-[150%] peer-valid:text-purple-900">
              Enter your password
            </label>
            <span
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-white text-xl"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </span>
          </div>

          <button
            type="submit"
            className="bg-purple-900 text-white font-semibold border-none mt-15 py-4 w-[400px] cursor-pointer rounded-2xl text-base border-2 border-transparent transition-all duration-300 ease-in-out hover:text-slate-600 hover:bg-white/20 hover:border-white"
            style={{ backgroundColor: "#271950" }}
          >
            Sign In
          </button>

          <div className="text-center mt-8 text-white">
            <p>
              Already have an account?{" "}
              <a
                href="#"
                className="text-pink-200 no-underline hover:underline"
                onClick={handleSign}
              >
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Newlogin;
