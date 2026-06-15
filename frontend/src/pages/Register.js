import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    age: "",
    weightKg: "",
    heightCm: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        age: form.age ? parseInt(form.age) : undefined,
        weightKg: form.weightKg ? parseFloat(form.weightKg) : undefined,
        heightCm: form.heightCm ? parseFloat(form.heightCm) : undefined,
      };

      const { data } = await registerApi(payload);

      login(data);
      navigate("/dashboard");
    } catch (err) {
  setError(
    err.response?.data?.error ||
      err.response?.data?.message ||
      "Registration failed"
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: "1.5rem",
          }}
        >
          <span style={{ fontSize: 28 }}>🏃</span>

          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#378ADD",
            }}
          >
            FitTrack
          </span>
        </div>

        <div className="auth-title">Create account</div>

        <div className="auth-sub">
          Start tracking your fitness journey today
        </div>

        {error && <div className="error-msg">{error}</div>}


        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ marginBottom: 14 }}>
            <div className="form-group">
              <label>Username *</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="john_doe"
                required
              />
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div className="form-group full">
              <label>Email *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group full">
              <label>Password *</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                placeholder="25"
                min={1}
                max={120}
              />
            </div>

            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                name="weightKg"
                type="number"
                step="0.1"
                value={form.weightKg}
                onChange={handleChange}
                placeholder="70.0"
              />
            </div>

            <div className="form-group full">
              <label>Height (cm)</label>
              <input
                name="heightCm"
                type="number"
                step="0.1"
                value={form.heightCm}
                onChange={handleChange}
                placeholder="175.0"
              />
            </div>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
