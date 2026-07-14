import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import authBg from "../assets/auth.jpg";
import "./Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await registerUser({
        name,
        email,
        password,
      });

      console.log("Register Success:", data);

      alert("Registration Successful!");

      navigate("/login");
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert(error.response?.data?.message || "Registration Failed");
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
        <h1
          style={{
            textAlign: "center",
            marginBottom: "24px",
            fontSize: "2.5rem",
            lineHeight: "1.2",
            fontWeight: "700",
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          Create Account
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
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
          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "15px",
            }}
          >
            Register
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
          }}
        >
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
