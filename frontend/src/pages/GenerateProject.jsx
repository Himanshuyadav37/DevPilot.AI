import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import FileViewer from "../components/FileViewer";
import api from "../services/api";

import "./GenerateProject.css";

function GenerateProject() {

  const [idea, setIdea] = useState("");
  // const [agentType, setAgentType] = useState("engineer");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  async function generate() {

    if (!idea.trim()) {

      alert("Enter project idea");

      return;
    }

    try {

      setLoading(true);

      const response =
        await api.post(
          "/ai/execute-project",
          {
            idea
          }
        );

      console.log(
        response.data
      );

      setResult(
        response.data
      );

    }

    catch (error) {

      console.error(error);

      alert(
        "Generation Failed"
      );

    }

    finally {

      setLoading(false);
    }
  }

  const files =
    result?.generated_code?.files?.length
      ? result.generated_code.files
      : result?.fixed_code?.files || [];

  return (

    <DashboardLayout>

      <div className="generate-page">

        <div className="generate-card">

          <h1>
            Generate Software
          </h1>

          <p>
            Describe your software idea and let NeuroForge build it.
          </p>

          <textarea

            value={idea}

            onChange={(e) =>
              setIdea(
                e.target.value
              )
            }

            placeholder="Build an AI Resume Analyzer using FastAPI and MongoDB"

          />

          <button
            onClick={generate}
            disabled={loading}
          >

            {
              loading
                ? "Generating..."
                : "Generate Project"
            }

          </button>

        </div>

        {

          result && (

            <div className="output-card">

              <h2>
                Project Generated
              </h2>

              <div className="result-grid">

                <div className="result-box">

                  <span>
                    Project ID
                  </span>

                  <h3>
                    {
                      result.project_id
                    }
                  </h3>

                </div>

                <div className="result-box">

                  <span>
                    Status
                  </span>

                  <h3>
                    {
                      result.status
                    }
                  </h3>

                </div>

                <div className="result-box">

                  <span>
                    Iterations
                  </span>

                  <h3>
                    {
                      result.iterations
                    }
                  </h3>

                </div>

              </div>

              <div
                style={{
                  marginTop: "25px",
                  marginBottom: "30px"
                }}
              >

                <a
                  href={
                    `http://127.0.0.1:8000${result.zip_url}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="download-btn"
                >
                  ⬇ Download Project ZIP
                </a>

              </div>

              <div className="section">

                <h3>
                  Project Overview
                </h3>

                <p>

                  {
                    result.project_plan
                      ?.project_description
                  }

                </p>

              </div>

              <div className="section">

                <h3>
                  Tech Stack
                </h3>

                <div className="chips">

                  {

                    result.project_plan
                      ?.tech_stack
                      ?.frontend
                      ?.map(
                        item => (

                          <span
                            key={item}
                            className="chip"
                          >

                            {item}

                          </span>

                        )
                      )
                  }

                  {

                    result.project_plan
                      ?.tech_stack
                      ?.backend
                      ?.map(
                        item => (

                          <span
                            key={item}
                            className="chip"
                          >

                            {item}

                          </span>

                        )
                      )
                  }

                  {

                    result.project_plan
                      ?.tech_stack
                      ?.database
                      ?.map(
                        item => (

                          <span
                            key={item}
                            className="chip"
                          >

                            {item}

                          </span>

                        )
                      )
                  }

                </div>

              </div>

              <div className="section">

                <h3>
                  Execution Timeline
                </h3>

                <div className="execution-timeline">

                  {
                    result.execution_steps?.length > 0 ? (
                      result.execution_steps.map(
                        (step, index) => (
                          <div
  key={index}
  className="timeline-item"
>

                           <div className="timeline-time">
                              {new Date(step.timestamp).toLocaleTimeString()}
                            </div>

                            <div className="timeline-content">

                             <div className="timeline-header">

                                <span
  className={`badge ${step.status}`}
>
                                  {step.agent}
                                </span>

                                <span className="timeline-message">
                                  {step.message}
                                </span>

                              </div>

                              {
                                step.details && (
                                  <div className="timeline-details">
                                    {Object.entries(step.details).map(
  ([key, value]) => {

    let displayValue;

    if (Array.isArray(value)) {
      displayValue = value.join(", ");
    } else if (
      typeof value === "object" &&
      value !== null
    ) {
      displayValue = JSON.stringify(value);
    } else {
      displayValue = String(value);
    }

    return (
      <span
        key={key}
        style={{
          marginRight: "16px"
        }}
      >
        {key}: {displayValue}
      </span>
    );
  }
)}
                                  </div>
                                )
                              }

                            </div>

                          </div>
                        )
                      )
                    ) : (
                      <p className="timeline-empty">
                        No execution steps recorded
                      </p>
                    )

                  }

                </div>

              </div>

              <div className="section">

                <h3>
                  Features
                </h3>

                <ul>

                  {

                    result.project_plan
                      ?.features
                      ?.map(
                        (
                          feature,
                          index
                        ) => (

                          <li
                            key={index}
                          >

                            {feature}

                          </li>

                        )
                      )
                  }

                </ul>

              </div>

              {

                files.length > 0 && (

                  <div className="section">

                    <h3>
                      Generated Files
                    </h3>

                    <FileViewer
                      files={files}
                    />

                  </div>

                )
              }

              {

                result.debug_report && (

                  <div className="section">

                    <h3>
                      Debug Report
                    </h3>

                    <div
                      className="debug-box"
                    >

                      {
                        result.debug_report
                      }

                    </div>

                  </div>

                )
              }

            </div>

          )
        }

      </div>

    </DashboardLayout>

  );
}

export default GenerateProject;