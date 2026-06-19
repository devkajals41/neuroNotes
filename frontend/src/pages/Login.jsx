import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import { loginUser } from "../services/authService";
import "./Auth.css";
import { FaBrain } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

      

      // Go to Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.log("Login Error:", error.response?.data || error.message);

      alert("Login Failed!");
    }
  };

  return (
  <div className="auth-container">
    <div className="auth-card">

      <h1 className="auth-title">
        <FaBrain /> NeuroNotes
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="auth-button"
          type="submit"
        >
          Login
        </button>
        <p
  style={{
    textAlign: "center",
    marginTop: "15px",
  }}
>
  Don't have an account?{" "}
  <Link to="/register">
    Register
  </Link>
</p>
      </form>

    </div>
  </div>
);
}

export default Login;
