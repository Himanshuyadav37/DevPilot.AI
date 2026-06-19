import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projectAPI } from "../api/client";
import TaskInput from "../components/TaskInput";
import "./dashboard.css";

function StatusBadge({ status }) {
  return (
    <span className={"history-badge badge-" + status}>
      {status === "running" && (
        <span className="badge-pulse"></span>
      )}
      {status}
    </span>
  );
}

function timeAgo(dateStr) {
  const diff =
    Date.now() - new Date(dateStr).getTime();

  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;

  return "just now";
}

export default function Dashboard() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    projectAPI
      .getHistory()
      .then((res) => {
        setRuns(res.data.runs || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  const handleRun = async (task) => {
    setLoading(true);

    try {
      const res = await projectAPI.run(task);
      navigate(`/run/${res.data.run_id}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const completedRuns = runs.filter(
    (run) => run.status === "completed"
  ).length;

  const runningRuns = runs.filter(
    (run) => run.status === "running"
  ).length;

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div className="nav-brand">
          <div className="logo-box">⚡</div>
          <span className="nav-name">
            DevPilot AI
          </span>
        </div>

        <div className="nav-right">
          <span className="nav-user">
            Welcome
          </span>
        </div>
      </nav>

      <div className="dashboard-body">
        <section className="dashboard-hero">
          <div className="hero-badge">
            Multi-Agent Autonomous Development
            Platform
          </div>

          <h1 className="hero-title">
            Build Production-Ready Software
          </h1>

          <p className="hero-sub">
            DevPilot orchestrates planning,
            coding, testing, debugging and
            deployment through autonomous AI
            agents.
          </p>
        </section>

        <section className="metrics-grid">
          <div className="metric-card">
            <h2>{runs.length}</h2>
            <span>Total Runs</span>
          </div>

          <div className="metric-card">
            <h2>{completedRuns}</h2>
            <span>Successful Runs</span>
          </div>

          <div className="metric-card">
            <h2>{runningRuns}</h2>
            <span>Active Runs</span>
          </div>

          <div className="metric-card">
            <h2>5</h2>
            <span>AI Agents</span>
          </div>
        </section>

        <section className="task-section">
          <TaskInput
            onSubmit={handleRun}
            loading={loading}
          />
        </section>

        <section className="pipeline-section">
          <div className="section-header">
            <h2>Agent Workflow</h2>
          </div>

          <div className="pipeline-overview">
            <div className="overview-card">
              <div className="agent-icon">🗂</div>
              <h4>Planning</h4>
            </div>

            <div className="overview-card">
              <div className="agent-icon">⚙</div>
              <h4>Code</h4>
            </div>

            <div className="overview-card">
              <div className="agent-icon">🧪</div>
              <h4>Test</h4>
            </div>

            <div className="overview-card">
              <div className="agent-icon">🔍</div>
              <h4>Debug</h4>
            </div>

            <div className="overview-card">
              <div className="agent-icon">🚀</div>
              <h4>Deploy</h4>
            </div>
          </div>
        </section>

        <section className="history-section">
          <div className="history-header">
            <h2 className="history-title">
              Recent Runs
            </h2>

            <span className="history-count">
              {runs.length} Total
            </span>
          </div>

          {fetching ? (
            <div className="history-loading">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="skeleton-row"
                />
              ))}
            </div>
          ) : runs.length === 0 ? (
            <div className="history-empty">
              <span className="empty-icon">
                ⚡
              </span>

              <p className="empty-title">
                No Runs Yet
              </p>

              <p className="empty-sub">
                Your first run will appear here
              </p>
            </div>
          ) : (
            <div className="history-list">
              {runs.map((run) => (
                <div
                  key={run.run_id}
                  className="history-row"
                  onClick={() =>
                    navigate(`/run/${run.run_id}`)
                  }
                >
                  <div className="history-row-left">
                    <StatusBadge
                      status={run.status}
                    />

                    <p className="history-task">
                      {run.task}
                    </p>
                  </div>

                  <div className="history-row-right">
                    <span className="history-time">
                      {timeAgo(run.created_at)}
                    </span>

                    <span className="history-arrow">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}