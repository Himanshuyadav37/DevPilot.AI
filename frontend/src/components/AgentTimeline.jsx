import {
  ClipboardList,
  Code2,
  ShieldCheck,
  Bug,
  Rocket,
  Play
} from "lucide-react";

import "./AgentTimeline.css";

function AgentTimeline() {

  const agents = [
    {
      title:"Initiate Workflow",
      icon:<Play size={24}/>,
      status:"active"
    },
    {
      title:"Planner",
      icon:<ClipboardList size={24}/>,
      status:"active"
    },
    {
      title:"Coder",
      icon:<Code2 size={24}/>,
      status:"idle"
    },
    {
      title:"Tester",
      icon:<ShieldCheck size={24}/>,
      status:"active"
    },
    {
      title:"Debugger",
      icon:<Bug size={24}/>,
      status:"idle"
    },
    {
      title:"Deployer",
      icon:<Rocket size={24}/>,
      status:"idle"
    }
  ];

  return (

    <div className="workflow-card">

      <div className="workflow-top">

        <h2>
          AI Workflow
        </h2>

        <span className="workflow-subtitle">
          process roadmap
        </span>

        <div className="workflow-status">
          <span className="status-dot"></span>
          All Systems Active
        </div>

      </div>

      <div className="workflow-container">

        {
          agents.map(
            (agent,index)=>(

              <div
                className={`workflow-step ${agent.status}`}
                key={agent.title}
              >

                <div className="workflow-icon">
                  {agent.icon}
                </div>

                <div className="workflow-text">
                  <p>
                    {agent.title}
                  </p>
                  <span className={`agent-status ${agent.status}`}>
                    Agent {agent.status === "active" ? "Active" : "Idle"}
                  </span>
                </div>

                {
                  index !== 5 &&
                  <div className="workflow-line"/>
                }

              </div>

            )
          )
        }

      </div>

    </div>

  );
}

export default AgentTimeline;