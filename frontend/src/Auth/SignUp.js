import React, { useState } from "react";
import { useGlobalContext } from "../Context/GlobalContext";
import "./Auth.css";
import { Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { signup, error, setError } = useGlobalContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setLoading(true);

    try {
      await signup({ name, email, password, role });
      setSuccessMessage(
        'Signup successful! Please check your email to verify your account before logging in.'
      );
      setName('');
      setEmail('');
      setPassword('');
      setRole('');
    } catch {
      // error handled by context already
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>
        {error && <p className="auth-error">{error}</p>}
        <div className="auth-input">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="auth-input">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="auth-input">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="auth-input">
          <label>Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>
        <button
        className="auth-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        <div>
          Already an Account?{" "}
          <Link
            to={"/login"}
            style={{ color: "orange", textDecoration: "none" }}
          >
            Login Now
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
