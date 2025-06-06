import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Newlogin.css";

const Newlogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSign = (e) => {
    e.preventDefault();
    navigate("/sign");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Simpan user data ke state/context/redux jika perlu
      console.log("Login success:", data.user);

      // Redirect ke home setelah login sukses
      navigate("/dash");
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="newlogin-container font-roboto">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h3 className="opacity-50 text-white text-left">
            Please enter your details
          </h3>
          <h2 className="font-bold text-left">Welcome Back!</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="input-field">
            <input
              type="text"
              autoComplete="off"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>Enter your email</label>
          </div>
          <div className="input-field">
            <input
              type="password"
              autoComplete="off"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label>Enter your password</label>
          </div>
          <div className="forget">
            <label htmlFor="remember">
              <input type="checkbox" id="remember" />
              <p>Remember me</p>
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit">Log In</button>
          <div className="register">
            <p onClick={handleSign}>
              Don't have an account? <a href="#">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Newlogin;
