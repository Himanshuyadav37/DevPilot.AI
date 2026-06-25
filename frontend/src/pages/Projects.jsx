import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../services/api";

import "./Projects.css";

function Projects() {

  const [
    projects,
    setProjects
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  useEffect(() => {

    void loadProjects();

  }, []);

  async function loadProjects() {

    try {

      setLoading(true);

      const response =
        await api.get(
          "/ai/executions"
        );

      console.log(
        "Executions:",
        response.data
      );

      setProjects(
        response.data || []
      );

    }

    catch (err) {

      console.error(err);

      setError(
        "Failed to load projects"
      );

    }

    finally {

      setLoading(false);

    }

  }

  return (

    <DashboardLayout>

      <div className="page-header">

        <h1>
          Generated Projects
        </h1>

        <p>
          Browse all AI generated projects
        </p>

      </div>

      {

        loading ? (

          <div className="page-state">

            Loading Projects...

          </div>

        ) : error ? (

          <div className="page-state error">

            {error}

          </div>

        ) : projects.length === 0 ? (

          <div className="page-state">

            No Projects Found

          </div>

        ) : (

          <div className="projects-grid">

            {

              projects.map(
                (
                  project
                ) => (

                  <div
                    key={project._id}
                    className="project-card"
                  >

                    <Link
                      to={`/projects/${project._id}`}
                      className="project-card-link"
                    >

                    <h3>

                      {

                        project.project_plan
                          ?.project_name ||

                        project.idea ||

                        "Untitled Project"

                      }

                    </h3>

                    <p>

                      Status: {

                        project.status ||

                        "completed"

                      }

                    </p>

                    <div
                      className="
                      project-meta
                      "
                    >

                      <span>

                        Iterations:

                        {" "}

                        {

                          project.iterations ||

                          0

                        }

                      </span>

                    </div>

                    <small>

                      {

                        project.created_at

                          ?

                          new Date(
                            project.created_at
                          ).toLocaleString()

                          :

                          ""

                      }

                    </small>

                    </Link>

                    <Link
                      to={`/generate?projectId=${project.project_id}&executionId=${project._id}`}
                      className="continue-link"
                    >
                      Continue →
                    </Link>

                  </div>

                )

              )

            }

          </div>

        )

      }

    </DashboardLayout>

  );

}

export default Projects;