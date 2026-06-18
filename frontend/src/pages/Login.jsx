import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

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
      localStorage.setItem(
        "token",
        data.token
      );

      alert("Login Successful!");

      // Go to Dashboard
      navigate("/dashboard");

    } catch (error) {

      console.log(
        "Login Error:",
        error.response?.data || error.message
      );

      alert("Login Failed!");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;