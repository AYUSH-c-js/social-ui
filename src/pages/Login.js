import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, forgotpassword } from "../api/auth";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.user._id);
      navigate("/profile");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotpassword({ email: forgotEmail });
      setMessage("Password reset email sent!");
      setShowForgot(false);
      setForgotEmail("");
    } catch (err) {
      setMessage("Failed to send reset email.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="info-message">{message}</p>}

        {!showForgot ? (
          <>
            <form onSubmit={handleSubmit}>
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
              <button type="submit">Login</button>
            </form>
            <p className="forgot-link" onClick={() => setShowForgot(true)}>Forgot Password?</p>
          </>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            <button type="submit">Send Reset Email</button>
            <p className="forgot-link" onClick={() => setShowForgot(false)}>Back to Login</p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
