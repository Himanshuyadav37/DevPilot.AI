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

function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    const result = await login(
      email,
      password
    );

    if (result.success) {

      navigate("/dashboard");

    }

    else {

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

{/* ==========================
        LEFT SIDE
========================== */}

<div className="auth-left">

<div className="brand-badge">

<Sparkles size={15} />

<span>

NeuroForge AI Operating System

</span>

</div>

<h1>

Build with

<span>

AI Agents

</span>

</h1>

<p>

NeuroForge combines multiple specialized AI modules into one intelligent platform for software engineering, research, education and workflow automation.

</p>

<div className="feature-grid">

<div className="feature-card">

<Code2 size={22} />

<div>

<h3>

Engineer AI

</h3>

<p>

Generate complete production-ready applications.

</p>

</div>

</div>

<div className="feature-card">

<MessageSquare size={22} />

<div>

<h3>

Conversational AI

</h3>

<p>

Natural conversations with persistent memory.

</p>

</div>

</div>

<div className="feature-card">

<BrainCircuit size={22} />

<div>

<h3>

Research AI

</h3>

<p>

Deep research with tools and citations.

</p>

</div>

</div>

<div className="feature-card">

<Bot size={22} />

<div>

<h3>

Automation AI

</h3>

<p>

Automate repetitive workflows intelligently.

</p>

</div>

</div>

</div>

<div className="system-status">

<div className="status-dot"></div>

<span>

System Status

</span>

<strong>

Operational

</strong>

</div>

</div>

{/* ==========================
        RIGHT SIDE
========================== */}

<div className="auth-right">

<div className="auth-card">

<div className="login-icon">

<Cpu size={34} />

</div>

<div className="auth-header">

<h2>

Welcome Back

</h2>

<p>

Sign in to continue using NeuroForge

</p>

</div>

{

error && (

<div className="auth-error">

<ShieldCheck size={18} />

<span>

{error}

</span>

</div>

)

}

<form

onSubmit={handleSubmit}

className="auth-form"

>

<div className="form-group">

<label>

Email Address

</label>

<input

type="email"

placeholder="you@example.com"

value={email}

onChange={(e)=>

setEmail(

e.target.value

)

}

required

/>

</div>

<div className="form-group">

<label>

Password

</label>

<input

type="password"

placeholder="••••••••"

value={password}

onChange={(e)=>

setPassword(

e.target.value

)

}

required

/>

</div>

<button

type="submit"

className="auth-button"

disabled={loading}

>

{

loading

?

"Signing In..."

:

<>

<span>

Sign In

</span>

<ArrowRight

size={18}

/>

</>

}

</button>

</form>

<div className="divider">

<span>

OR

</span>

</div>

<div className="auth-footer">

<p>

Don't have an account?

</p>

<Link

to="/signup"

>

Create Account

</Link>

</div>

</div>

</div>

</div>

  );

}

export default Login;