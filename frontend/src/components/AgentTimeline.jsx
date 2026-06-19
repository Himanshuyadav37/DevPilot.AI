const AGENTS = [
  {
    key: "planner",
    label: "Planner",
    icon: "🗂",
    desc: "Analyzing task & creating execution plan",
    doneDesc: "Plan created",
  },
  {
    key: "coder",
    label: "Coder",
    icon: "⚙",
    desc: "Generating code with RAG context",
    doneDesc: "Code generated",
  },
  {
    key: "tester",
    label: "Tester",
    icon: "🧪",
    desc: "Writing & running unit tests",
    doneDesc: "Tests executed",
  },
  {
    key: "debugger",
    label: "Debugger",
    icon: "🔍",
    desc: "Analyzing failures & fixing bugs",
    doneDesc: "Bugs fixed",
  },
  {
    key: "deployer",
    label: "Deployer",
    icon: "🚀",
    desc: "Generating Dockerfile & deployment files",
    doneDesc: "Ready to deploy",
  },
];

function getAgentStatus(agentKey, currentAgent, status) {
  if (status === "completed") return "done";
  if (!currentAgent) return "waiting";

  const currentIndex = AGENTS.findIndex((a) =>
    currentAgent.startsWith(a.key)
  );

  const thisIndex = AGENTS.findIndex((a) => a.key === agentKey);

  if (thisIndex < currentIndex) return "done";
  if (thisIndex === currentIndex) return "active";
  return "waiting";
}

export default function AgentTimeline({
  currentAgent,
  status,
  testResults,
  debugAttempts,
  errors,
}) {
  return (
    <div className="timeline-wrapper">
      <div className="timeline-header">
        <span className="timeline-title">Agent Pipeline</span>

        <span className={`status-badge status-${status}`}>
          {status === "running" && <span className="pulse-dot" />}
          {status}
        </span>
      </div>

      <div className="timeline-steps">
        {AGENTS.map((agent, idx) => {
          const agentStatus = getAgentStatus(
            agent.key,
            currentAgent,
            status
          );

          const isDebugger = agent.key === "debugger";

          return (
            <div
              key={agent.key}
              className={`timeline-step step-${agentStatus}`}
            >
              <div className="step-connector">
                <div className={`step-dot dot-${agentStatus}`}>
                  {agentStatus === "done" ? (
                    <span className="dot-check">✓</span>
                  ) : agentStatus === "active" ? (
                    <span className="dot-spinner" />
                  ) : (
                    <span className="dot-num">{idx + 1}</span>
                  )}
                </div>

                {idx < AGENTS.length - 1 && (
                  <div
                    className={`step-line line-${
                      agentStatus === "done" ? "done" : "waiting"
                    }`}
                  />
                )}
              </div>

              <div className="step-content">
                <div className="step-top">
                  <span className="step-icon">{agent.icon}</span>
                  <span className="step-label">{agent.label}</span>

                  {isDebugger && debugAttempts > 0 && (
                    <span className="attempt-badge">
                      Attempt {debugAttempts}/3
                    </span>
                  )}
                </div>

                <p className="step-desc">
                  {agentStatus === "done"
                    ? agent.doneDesc
                    : agent.desc}
                </p>

                {agent.key === "tester" &&
                  testResults &&
                  agentStatus === "done" && (
                    <div
                      className={`test-result ${
                        testResults.passed ? "passed" : "failed"
                      }`}
                    >
                      {testResults.passed
                        ? "✓ All tests passed"
                        : "✗ Tests failed — routing to debugger"}
                    </div>
                  )}

                {agentStatus === "active" && (
                  <div className="step-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {errors && errors.length > 0 && (
        <div className="timeline-errors">
          <span className="error-title">⚠ Errors</span>

          {errors.map((err, i) => (
            <p key={i} className="error-msg">
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}