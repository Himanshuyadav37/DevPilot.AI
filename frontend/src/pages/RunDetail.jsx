import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectAPI } from "../api/client";
import AgentTimeline from "../components/AgentTimeline";
import CodeViewer from "../components/CodeViewer";

export default function RunDetail() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const [run, setRun] = useState(null);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const res = await projectAPI.getStatus(runId);
      setRun(res.data);
      if (res.data.status !== "running") {
        clearInterval(intervalRef.current);
      }
    } catch (err) {
      setError("Failed to fetch run status");
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, 2000);
    return () => clearInterval(intervalRef.current);
  }, [runId]);

  const finalState = run?.final_state || {};
  const generatedCode = finalState.generated_code || finalState.fixed_code || null;
  const deploymentFiles = finalState.deployment_files || null;
  const hasCode = generatedCode && Object.keys(generatedCode).length > 0;

  return (
    <div className="rundetail-page">
      <nav className="navbar">
        <div className="nav-brand">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <span className="nav-logo">⚡</span>
          <span className="nav-name">DevPilot AI</span>
        </div>
        <div className="nav-right">
          <span className="run-id-label">Run ID: {runId?.slice(0, 8)}...</span>
        </div>
      </nav>

      <div className="rundetail-body">
        {error && <div className="run-error">{error}</div>}

        {!run ? (
          <div className="run-loading">
            <div className="loading-spinner" />
            <p>Connecting to pipeline...</p>
          </div>
        ) : (
          <>
            <div className="run-task-bar">
              <span className="run-task-label">Task</span>
              <p className="run-task-text">{run.task}</p>
            </div>

            <div className="rundetail-grid">
              <div className="rundetail-left">
                <AgentTimeline
                  currentAgent={run.current_agent || finalState.current_agent}
                  status={run.status}
                  testResults={finalState.test_results}
                  debugAttempts={finalState.debug_attempts || 0}
                  errors={finalState.errors}
                />

                {finalState.plan && (
                  <div className="plan-card">
                    <h3 className="plan-title">Execution Plan</h3>
                    <div className="plan-meta">
                      <span className="plan-tag">
                        Complexity: {finalState.plan.complexity || "—"}
                      </span>
                      <span className="plan-tag">
                        {(finalState.plan.tech_stack || []).join(", ")}
                      </span>
                    </div>
                    <div className="plan-files">
                      <p className="plan-files-label">Files to generate:</p>
                      <div className="plan-files-list">
                        {(finalState.plan.files || []).map((f) => (
                          <span key={f} className="plan-file-chip">{f}</span>
                        ))}
                      </div>
                    </div>
                    {(finalState.plan.subtasks || []).map((st, i) => (
                      <div key={i} className="plan-subtask">
                        <span className="subtask-file">{st.file}</span>
                        <span className="subtask-desc">{st.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rundetail-right">
                {hasCode ? (
                  <CodeViewer
                    files={generatedCode}
                    deploymentFiles={deploymentFiles}
                  />
                ) : (
                  <div className="code-waiting">
                    <div className="waiting-animation">
                      <span className="waiting-dot" style={{ animationDelay: "0s" }} />
                      <span className="waiting-dot" style={{ animationDelay: "0.2s" }} />
                      <span className="waiting-dot" style={{ animationDelay: "0.4s" }} />
                    </div>
                    <p className="waiting-text">
                      {run.status === "running"
                        ? "Agents are working — code will appear here..."
                        : "No code generated"}
                    </p>
                  </div>
                )}

                {run.status === "completed" && (
                  <div className="success-banner">
                    <span className="success-icon">✓</span>
                    <div>
                      <p className="success-title">Pipeline completed successfully</p>
                      <p className="success-sub">All agents finished — your code is ready</p>
                    </div>
                  </div>
                )}

                {run.status === "failed" && (
                  <div className="fail-banner">
                    <span className="fail-icon">✗</span>
                    <div>
                      <p className="fail-title">Pipeline failed</p>
                      <p className="fail-sub">
                        {(finalState.errors || []).join(". ") || "An unexpected error occurred"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}