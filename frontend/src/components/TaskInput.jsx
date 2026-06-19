import { useState } from "react";

const EXAMPLES = [
  "Build a FastAPI CRUD app with MongoDB and JWT auth",
  "Create a REST API for a todo app with PostgreSQL",
  "Generate a Python scraper with rate limiting and retry logic",
  "Build a LangChain chatbot with memory and streaming",
];

export default function TaskInput({ onSubmit, loading }) {
  const [task, setTask] = useState("");

  const handleSubmit = () => {
    if (!task.trim() || loading) return;
    onSubmit(task.trim());
  };

  return (
    <div className="task-input-wrapper">
      <div className="task-header">
        <span className="task-label">Describe what you want to build</span>
        <span className="task-hint">{task.length}/500</span>
      </div>

      <textarea
        className="task-textarea"
        placeholder="e.g. Build a FastAPI app with MongoDB, JWT auth, and CRUD endpoints for a blog..."
        value={task}
        onChange={(e) => setTask(e.target.value.slice(0, 500))}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.metaKey) handleSubmit();
        }}
        rows={4}
        disabled={loading}
      />

      <div className="task-examples">
        <span className="examples-label">Try an example:</span>
        <div className="examples-list">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              className="example-chip"
              onClick={() => setTask(ex)}
              disabled={loading}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div className="task-footer">
        <span className="task-tip">
          <span className="tip-icon">⌘</span> + Enter to run
        </span>
        <button
          className={`run-btn ${loading ? "loading" : ""}`}
          onClick={handleSubmit}
          disabled={loading || !task.trim()}
        >
          {loading ? (
            <>
              <span className="spinner" /> Generating...
            </>
          ) : (
            <>
              <span className="btn-icon">▶</span> Run DevPilot
            </>
          )}
        </button>
      </div>
    </div>
  );
}