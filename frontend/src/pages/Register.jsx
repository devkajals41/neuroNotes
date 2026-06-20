import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data =
        await registerUser({
          name,
          email,
          password,
        });

      console.log(
        "Register Success:",
        data
      );

      alert(
        "Registration Successful!"
      );

      navigate("/login");
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data
          ?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        background: "#f4f7fc",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
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

        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

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
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;