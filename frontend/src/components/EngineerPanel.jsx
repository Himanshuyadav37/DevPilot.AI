import { useEffect, useState } from "react";
import FileViewer from "./FileViewer";
import api from "../services/api";

function EngineerPanel({

  result

}) {

  const [diffs, setDiffs] = useState([]);

  useEffect(() => {
    if (!result?.execution_id) return;

    const hasFixed = result?.fixed_code?.files?.length > 0;
    const hasGenerated = result?.generated_code?.files?.length > 0;

    if (hasFixed && hasGenerated) {
      api
        .get(`/ai/executions/${result.execution_id}/diff?compare=fixed`)
        .then(res => setDiffs(res.data || []))
        .catch(() => setDiffs([]));
    }
  }, [result?.execution_id]);

  if (!result) return null;

  const files =

    result?.generated_code?.files?.length

      ? result.generated_code.files

      : result?.fixed_code?.files || [];

  return (

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

            {result.project_id}

          </h3>

        </div>

        <div className="result-box">

          <span>

            Status

          </span>

          <h3>

            {result.status}

          </h3>

        </div>

        <div className="result-box">

          <span>

            Iterations

          </span>

          <h3>

            {result.iterations}

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

          href={`http://127.0.0.1:8000${result.zip_url}`}

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

            result.project_plan?.project_description

          }

        </p>

      </div>

      <div className="section">

        <h3>

          Tech Stack

        </h3>

        <div className="chips">

          {

            result.project_plan?.tech_stack?.frontend?.map(

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

            result.project_plan?.tech_stack?.backend?.map(

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

            result.project_plan?.tech_stack?.database?.map(

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

            result.execution_steps?.length > 0

              ? result.execution_steps.map(

                  (

                    step,

                    index

                  ) => (

                    <div

                      key={index}

                      className="timeline-item"

                    >

                      <div className="timeline-time">

                        {

                          new Date(

                            step.timestamp

                          ).toLocaleTimeString()

                        }

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

                              {

                                Object.entries(

                                  step.details

                                ).map(

                                  ([key, value]) => (

                                    <span

                                      key={key}

                                      style={{

                                        marginRight: "16px"

                                      }}

                                    >

                                      {

                                        key

                                      }

                                      : {

                                        Array.isArray(value)

                                          ? value.join(", ")

                                          : typeof value === "object"

                                          ? JSON.stringify(value)

                                          : String(value)

                                      }

                                    </span>

                                  )

                                )

                              }

                            </div>

                          )

                        }

                      </div>

                    </div>

                  )

                )

              : (

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

            result.project_plan?.features?.map(

              (

                feature,

                index

              ) => (

                <li key={index}>

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

              diffs={diffs}

              showDiffToggle={diffs.length > 0}

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

            <div className="debug-box">

              {

                result.debug_report

              }

            </div>

          </div>

        )

      }

    </div>

  );

}

export default EngineerPanel;