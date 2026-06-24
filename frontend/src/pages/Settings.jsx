import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import "./Settings.css";

function Settings() {

  const [
    darkMode,
    setDarkMode
  ] = useState(true);

  const [
    autoDebug,
    setAutoDebug
  ] = useState(true);

  const [
    autoDeploy,
    setAutoDeploy
  ] = useState(false);

  const [
    notifications,
    setNotifications
  ] = useState(true);

  return (

    <DashboardLayout>

      <div className="settings-page">

        <div className="settings-header">

          <h1>
            Settings
          </h1>

          <p>
            Manage your NeuroForge
            preferences and AI workflow
            configuration.
          </p>

        </div>

        <div className="settings-grid">

          <div className="settings-card">

            <h2>
              Appearance
            </h2>

            <div className="setting-item">

              <div>

                <h4>
                  Dark Mode
                </h4>

                <p>
                  Use NeuroForge dark theme
                </p>

              </div>

              <label className="switch">

                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() =>
                    setDarkMode(
                      !darkMode
                    )
                  }
                />

                <span className="slider" />

              </label>

            </div>

          </div>

          <div className="settings-card">

            <h2>
              AI Agents
            </h2>

            <div className="setting-item">

              <div>

                <h4>
                  Auto Debug
                </h4>

                <p>
                  Automatically run debugger
                  on failed tests
                </p>

              </div>

              <label className="switch">

                <input
                  type="checkbox"
                  checked={autoDebug}
                  onChange={() =>
                    setAutoDebug(
                      !autoDebug
                    )
                  }
                />

                <span className="slider" />

              </label>

            </div>

            <div className="setting-item">

              <div>

                <h4>
                  Auto Deploy
                </h4>

                <p>
                  Deploy project after
                  successful generation
                </p>

              </div>

              <label className="switch">

                <input
                  type="checkbox"
                  checked={autoDeploy}
                  onChange={() =>
                    setAutoDeploy(
                      !autoDeploy
                    )
                  }
                />

                <span className="slider" />

              </label>

            </div>

          </div>

          <div className="settings-card">

            <h2>
              Notifications
            </h2>

            <div className="setting-item">

              <div>

                <h4>
                  Execution Alerts
                </h4>

                <p>
                  Receive notifications
                  when execution completes
                </p>

              </div>

              <label className="switch">

                <input
                  type="checkbox"
                  checked={
                    notifications
                  }
                  onChange={() =>
                    setNotifications(
                      !notifications
                    )
                  }
                />

                <span className="slider" />

              </label>

            </div>

          </div>

          <div className="settings-card">

            <h2>
              System Information
            </h2>

            <div className="info-row">

              <span>
                Version
              </span>

              <strong>
                NeuroForge v1.0
              </strong>

            </div>

            <div className="info-row">

              <span>
                AI Engine
              </span>

              <strong>
                LangGraph
              </strong>

            </div>

            <div className="info-row">

              <span>
                Model
              </span>

              <strong>
                Llama 3.3 70B
              </strong>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );

}

export default Settings;