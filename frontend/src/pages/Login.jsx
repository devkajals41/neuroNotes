import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../services/authService";
import "./Auth.css";
import authBg from "../assets/auth.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({
        email,
        password,
      });

      console.log("Login Success:", data);

      // Save JWT token in browser

      localStorage.setItem("token", data.token);

      localStorage.setItem("userName", data.name);

      // Go to Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.log("Login Error:", error.response?.data || error.message);

      alert("Login Failed!");
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${authBg})`,
      }}
    >
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">NeuroNotes</h1>

          <p className="auth-subtitle">Learn Smarter With AI</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-wrapper">
            <input
              className="auth-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button className="auth-button" type="submit">
            Login
          </button>
          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
