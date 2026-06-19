import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        await authAPI.register(form);
        setMode("login");
        setError("");
        setForm({ ...form, username: "" });
      } else {
        const res = await authAPI.login({ email: form.email, password: form.password });
        login(res.data.access_token, { email: form.email });
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-logo">
            <span className="logo-icon">⚡</span>
          </div>
          <h1 className="brand-name">DevPilot AI</h1>
          <p className="brand-tagline">Autonomous code generation powered by 5 AI agents working in sync</p>
        </div>

        <div className="agent-preview">
          {["Planner", "Coder", "Tester", "Debugger", "Deployer"].map((agent, i) => (
            <div key={agent} className="agent-chip" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="chip-dot" />
              {agent}
            </div>
          ))}
        </div>

        <div className="login-stats">
          <div className="stat">
            <span className="stat-num">5</span>
            <span className="stat-label">Specialized Agents</span>
          </div>
          <div className="stat">
            <span className="stat-num">RAG</span>
            <span className="stat-label">Context-Aware</span>
          </div>
          <div className="stat">
            <span className="stat-num">∞</span>
            <span className="stat-label">Code Tasks</span>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-tabs">
            <button
              className={`login-tab ${mode === "login" ? "tab-active" : ""}`}
              onClick={() => { setMode("login"); setError(""); }}
            >
              Sign in
            </button>
            <button
              className={`login-tab ${mode === "register" ? "tab-active" : ""}`}
              onClick={() => { setMode("register"); setError(""); }}
            >
              Create account
            </button>
          </div>

          <div className="login-form">
            <h2 className="form-title">
              {mode === "login" ? "Welcome back" : "Get started"}
            </h2>
            <p className="form-subtitle">
              {mode === "login"
                ? "Sign in to your DevPilot workspace"
                : "Create your DevPilot account"}
            </p>

            {mode === "register" && (
              <div className="field-group">
                <label className="field-label">Username</label>
                <input
                  className="field-input"
                  type="text"
                  placeholder="John Doe"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
            )}

            <div className="field-group">
              <label className="field-label">Email</label>
              <input
                className="field-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button
              className={`submit-btn ${loading ? "btn-loading" : ""}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <><span className="btn-spinner" /> Processing...</>
              ) : mode === "login" ? (
                "Sign in →"
              ) : (
                "Create account →"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}