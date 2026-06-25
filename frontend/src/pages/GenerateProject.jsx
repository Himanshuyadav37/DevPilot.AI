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
import EducationPanel from "../components/EducationPanel";
import AutomationPanel from "../components/AutomationPanel";

// Context & Services
import { useChat } from "../contexts/ChatContext";
import api from "../services/api";

// Icons & Styles
import { Sparkles, Cpu, ArrowRight } from "lucide-react";
import "./GenerateProject.css";

function GenerateProject() {
  const [searchParams] = useSearchParams();
  const continueProjectId = searchParams.get("projectId");
  const continueExecutionId = searchParams.get("executionId");

  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [continueMode, setContinueMode] = useState(false);

  const {
    conversationId,
    setConversationId,
    messages,
    setMessages,
    currentAgent,
    setCurrentAgent,
    selectedConversation
  } = useChat();

  /* =======================================
            Continue Project Mode
  ======================================== */
  useEffect(() => {
    if (continueProjectId || continueExecutionId) {
      setContinueMode(true);
      setCurrentAgent("engineer");
    }
  }, [continueProjectId, continueExecutionId, setCurrentAgent]);

  /* =======================================
          Load Previous Conversation
  ======================================== */
  useEffect(() => {
    if (!selectedConversation) return;

    setCurrentAgent(selectedConversation.agent_type);
    setIdea("");
    setResult(null);
  }, [selectedConversation, setCurrentAgent]);

  /* =======================================
             Generate Request
  ======================================== */
  async function handleGenerate(prompt) {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      const payload = {
        idea: prompt,
        agent_type: currentAgent,
        conversation_id: conversationId
      };

      if (continueMode) {
        payload.mode = "continue";
        payload.project_id = continueProjectId;
        payload.execution_id = continueExecutionId;
      }

      const response = await api.post("/ai/execute-project", payload);
      setResult(response.data);

      if (response.data.conversation_id) {
        setConversationId(response.data.conversation_id);
      }

      if (currentAgent === "conversational") {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: prompt },
          { role: "assistant", content: response.data.message }
        ]);
      }
    } catch (error) {
      console.error(error);
      alert("Generation Failed");
    } finally {
      setLoading(false);
    }
  }

  /* =======================================
                Agent Title
  ======================================== */
  function getTitle() {
    switch (currentAgent) {
      case "engineer":
        return {
          title: "Engineer AI",
          subtitle: "Build production-ready software using autonomous AI agents."
        };
      case "research":
        return {
          title: "Research AI",
          subtitle: "Deep research, competitor analysis and technical reports."
        };
      case "education":
        return {
          title: "Education AI",
          subtitle: "Learn faster with personalized AI tutoring."
        };
      case "automation":
        return {
          title: "Automation AI",
          subtitle: "Automate repetitive workflows using AI."
        };
      default:
        return {
          title: "Conversational AI",
          subtitle: "Talk naturally with NeuroForge."
        };
    }
  }

  const page = getTitle();

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
              <span>NeuroForge Workspace</span>
            </div>
            <h1>{page.title}</h1>
            <p>{page.subtitle}</p>
          </div>
          <div className="workspace-status">
            <Cpu size={18} />
            <span>Active</span>
          </div>
        </div>

        {continueMode && (
          <div className="continue-banner">
            <ArrowRight size={16} />
            Continuing existing project. Describe what you want to build next.
          </div>
        )}

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
                OUTPUT SECTION
        ============================ */}
        <div className="workspace-output">
          {/* Active Results Display Panels */}
          {currentAgent === "engineer" && result && (
            <EngineerPanel result={result} />
          )}
          {currentAgent === "conversational" && messages.length > 0 && (
            <ChatPanel messages={messages} />
          )}
          {currentAgent === "research" && result && (
            <ResearchPanel result={result} />
          )}
          {currentAgent === "education" && result && (
            <EducationPanel result={result} />
          )}
          {currentAgent === "automation" && result && (
            <AutomationPanel result={result} />
          )}

          {/* Empty State Display */}
          {!loading && !result && (currentAgent !== "conversational" || messages.length === 0) && (
            <div className="empty-state">
              <div className="empty-icon">
                <Cpu size={46} />
              </div>
              <h2>{page.title}</h2>
              <p>
                {currentAgent === "engineer"
                  ? "Describe your software idea and NeuroForge will plan, generate, test and debug it automatically."
                  : currentAgent === "research"
                  ? "Ask for market research, technical research or competitor analysis."
                  : currentAgent === "education"
                  ? "Learn any topic with structured explanations, quizzes and examples."
                  : currentAgent === "conversational"
                  ? "Start typing below to talk naturally with your assistant."
                  : "Create intelligent workflow automations using AI."}
              </p>
            </div>
          )}

          {/* Loading Animation Card */}
          {loading && (
            <div className="loading-card">
              <div className="loading-spinner"></div>
              <div>
                <h3>NeuroForge is thinking...</h3>
                <p>
                  {currentAgent === "engineer"
                    ? "Planner, Coder, Tester and Debugger are working."
                    : "Generating response..."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default GenerateProject;