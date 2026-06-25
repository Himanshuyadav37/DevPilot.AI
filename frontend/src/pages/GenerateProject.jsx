import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Layout & Core Components
import DashboardLayout from "../layouts/DashboardLayout";
import AgentSelector from "../components/AgentSelector";
import ChatInput from "../components/ChatInput";

// Agent Output Panels
import ChatPanel from "../components/ChatPanel";
import EngineerPanel from "../components/EngineerPanel";
import ResearchPanel from "../components/ResearchPanel";
import EducationPanel from "../components/education/EducationPanel.jsx";
import AutomationPanel from "../components/automation/AutomationPanel.jsx";

// Context & Services
import { useChat } from "../contexts/ChatContext";
import api from "../services/api";

// Icons & Styles
import {
  Sparkles,
  Cpu,
  ArrowRight
} from "lucide-react";

import "./GenerateProject.css";

function GenerateProject() {

  const [searchParams] =
    useSearchParams();

  const continueProjectId =
    searchParams.get("projectId");

  const continueExecutionId =
    searchParams.get("executionId");

  const [
    idea,
    setIdea
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    result,
    setResult
  ] = useState(null);

  const [
    continueMode,
    setContinueMode
  ] = useState(false);

  const {

    conversationId,

    setConversationId,

    messages,

    setMessages,

    currentAgent,

    setCurrentAgent,

    selectedConversation,

    refreshApp

  } = useChat();

  /* =======================================
         Continue Existing Project
  ======================================== */

  useEffect(() => {

    async function loadExecution() {

      if (!continueExecutionId)
        return;

      try {

        setContinueMode(true);

        setCurrentAgent(
          "engineer"
        );

        const response =
          await api.get(
            `/ai/executions/${continueExecutionId}`
          );

        console.log(
          "Continue Project",
          response.data
        );

        setResult(
          response.data
        );

      }

      catch (error) {

        console.error(
          error
        );

      }

    }

    loadExecution();

  }, [

    continueExecutionId,

    setCurrentAgent

  ]);

  /* =======================================
      Load Previous Conversation
  ======================================== */

  useEffect(() => {

    if (!selectedConversation)
      return;

    setCurrentAgent(
      selectedConversation.agent_type
    );

    setIdea("");

    setResult(null);

  }, [

    selectedConversation,

    setCurrentAgent

  ]);

  /* =======================================
          Generate / Continue
  ======================================== */

  async function handleGenerate(
    prompt
  ) {

    if (!prompt.trim())
      return;

    try {

      setLoading(true);

      const payload = {

        idea: prompt,

        agent_type:
          currentAgent,

        conversation_id:
          conversationId

      };

      if (continueMode) {

        payload.mode =
          "continue";

        payload.project_id =
          continueProjectId;

        payload.execution_id =
          continueExecutionId;

      }

      const response =
        await api.post(

          "/ai/execute-project",

          payload

        );

      setResult(
        response.data
      );

      /* Refresh whole application */

      refreshApp();

      if (
        response.data
          .conversation_id
      ) {

        setConversationId(

          response.data
            .conversation_id

        );

      }

      if (

        currentAgent ===

        "conversational"

      ) {

        setMessages(prev => [

          ...prev,

          {

            role: "user",

            content: prompt

          },

          {

            role: "assistant",

            content:
              response.data
                .message

          }

        ]);

      }

    }

    catch (error) {

      console.error(
        error
      );

      alert(
        "Generation Failed"
      );

    }

    finally {

      setLoading(false);

    }

  }

  /* =======================================
              Dynamic Title
  ======================================== */

  function getTitle() {

    switch (currentAgent) {

      case "engineer":

        return {

          title:
            "Engineer AI",

          subtitle:
            "Build production-ready software using autonomous AI agents."

        };

      case "research":

        return {

          title:
            "Research AI",

          subtitle:
            "Deep research, competitor analysis and technical reports."

        };

      case "education":

        return {

          title:
            "Education AI",

          subtitle:
            "Learn faster with personalized AI tutoring."

        };

      case "automation":

        return {

          title:
            "Automation AI",

          subtitle:
            "Automate repetitive workflows using AI."

        };

      default:

        return {

          title:
            "Conversational AI",

          subtitle:
            "Talk naturally with NeuroForge."

        };

    }

  }

  const page =
    getTitle();

  return (

    <DashboardLayout>

      <div className="workspace-page">
            {/* ===========================
              HEADER
      ============================ */}

      <div className="workspace-header">

        <div>

          <div className="workspace-badge">

            <Sparkles size={15} />

            <span>

              NeuroForge Workspace

            </span>

          </div>

          <h1>

            {page.title}

          </h1>

          <p>

            {page.subtitle}

          </p>

        </div>

        <div className="workspace-status">

          <Cpu size={18} />

          <span>

            Active

          </span>

        </div>

      </div>

      {

        continueMode && (

          <div className="continue-banner">

            <ArrowRight size={16} />

            Continuing existing project.

            Describe what you want to build next.

          </div>

        )

      }

      {/* ===========================
              INPUT PANEL
      ============================ */}

      <div className="workspace-card">

        <AgentSelector

          agentType={currentAgent}

          setAgentType={setCurrentAgent}

        />

        <ChatInput

          value={idea}

          onChange={setIdea}

          agentType={currentAgent}

          loading={loading}

          onSend={handleGenerate}

        />

      </div>

      {/* ===========================
              OUTPUT AREA
      ============================ */}

      <div className="workspace-output">

        {

          currentAgent === "engineer" &&

          result && (

            <EngineerPanel

              result={result}

            />

          )

        }

        {

          currentAgent === "conversational" && (

            <ChatPanel

              messages={messages}

            />

          )

        }

        {

          currentAgent === "research" &&

          result && (

            <ResearchPanel

              result={result}

            />

          )

        }

        {

          currentAgent === "education" &&

          result && (

            <EducationPanel

              result={result}

            />

          )

        }

        {

          currentAgent === "automation" &&

          result && (

            <AutomationPanel

              result={result}

            />

          )

        }

        {/* ===========================
                EMPTY STATE
        ============================ */}

        {

          !loading &&

          !result &&

          currentAgent !== "conversational" && (

            <div className="empty-state">

              <div className="empty-icon">

                <Cpu size={48} />

              </div>

              <h2>

                {page.title}

              </h2>

              <p>

                {

                  currentAgent === "engineer"

                  ?

                  "Describe your software idea and NeuroForge will automatically plan, generate, test and debug your application."

                  :

                  currentAgent === "research"

                  ?

                  "Ask NeuroForge to perform technical research, market analysis or competitor research."

                  :

                  currentAgent === "education"

                  ?

                  "Learn any topic through AI generated explanations, examples and quizzes."

                  :

                  "Create intelligent workflow automations powered by AI."

                }

              </p>

            </div>

          )

        }

        {/* ===========================
                LOADING
        ============================ */}

        {

          loading && (

            <div className="loading-card">

              <div className="loading-spinner"></div>

              <div>

                <h3>

                  NeuroForge is thinking...

                </h3>

                <p>

                  {

                    currentAgent === "engineer"

                    ?

                    "Planner, Coder, Tester and Debugger are collaborating..."

                    :

                    "Generating response..."

                  }

                </p>

              </div>

            </div>

          )

        }

      </div>

    </div>

  </DashboardLayout>

  );

}

export default GenerateProject;