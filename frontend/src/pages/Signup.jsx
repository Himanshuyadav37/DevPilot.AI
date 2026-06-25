import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import {
  Cpu,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Bot,
  BrainCircuit,
  Code2,
  MessageSquare
} from "lucide-react";

import "./Auth.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    const result = await signup(username, email, password);

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="blur blur1"></div>
        <div className="blur blur2"></div>
      </div>

      {/* =========================
              LEFT PANEL
      ========================= */}
      <div className="auth-left">
        <div className="brand-badge">
          <Sparkles size={15} />
          <span>NeuroForge AI Operating System</span>
        </div>

        <h1>
          Create with <span>AI Agents</span>
        </h1>

        <p>
          Build intelligent applications using NeuroForge's ecosystem of specialized AI agents.
          Engineer software, perform research, automate workflows and learn faster from one unified platform.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <Code2 size={22} />
            <div>
              <h3>Engineer AI</h3>
              <p>Generate complete full-stack applications.</p>
            </div>
          </div>

          <div className="feature-card">
            <MessageSquare size={22} />
            <div>
              <h3>Conversational AI</h3>
              <p>Chat naturally with persistent conversations.</p>
            </div>
          </div>

          <div className="feature-card">
            <BrainCircuit size={22} />
            <div>
              <h3>Research AI</h3>
              <p>Research papers, websites and documents.</p>
            </div>
          </div>

          <div className="feature-card">
            <Bot size={22} />
            <div>
              <h3>Automation AI</h3>
              <p>Automate repetitive tasks intelligently.</p>
            </div>
          </div>
        </div>

        <div className="system-status">
          <div className="status-dot"></div>
          <span>Platform Status</span>
          <strong>Ready</strong>
        </div>
      </div>

      {/* =========================
              RIGHT PANEL
      ========================= */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="login-icon">
            <Cpu size={34} />
          </div>

          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join NeuroForge and start building with AI.</p>
          </div>

          {error && (
            <div className="auth-error">
              <ShieldCheck size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="auth-footer">
            <p>Already have an account?</p>
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;