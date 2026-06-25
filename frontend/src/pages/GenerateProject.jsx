// ===============================
// GenerateProject.jsx (PART 1)
// Imports + State + Hooks + Generate Function
// ===============================

import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import AgentSelector from "../components/AgentSelector";
import ChatInput from "../components/ChatInput";
import ChatPanel from "../components/ChatPanel";
import EngineerPanel from "../components/EngineerPanel";
import ResearchPanel from "../components/ResearchPanel";
import EducationPanel from "../components/EducationPanel";
import AutomationPanel from "../components/AutomationPanel";
import { useChat } from "../contexts/ChatContext";
import api from "../services/api";
import "./GenerateProject.css";

function GenerateProject() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const {
    conversationId,
    setConversationId,
    messages,
    setMessages,
    currentAgent,
    setCurrentAgent,
    selectedConversation
  } = useChat();

  // ==========================
  // Load Previous Conversation
  // ==========================
  useEffect(() => {
    if (!selectedConversation) return;

    setCurrentAgent(selectedConversation.agent_type);
    setIdea("");
    setResult(null);
  }, [selectedConversation, setCurrentAgent]);

  // ==========================
  // Send Prompt
  // ==========================
  async function handleGenerate(prompt) {
    if (!prompt.trim()) return;

    try {
      setLoading(true);

      const response = await api.post("/ai/execute-project", {
        idea: prompt,
        agent_type: currentAgent,
        conversation_id: conversationId
      });

      setResult(response.data);

      if (response.data.conversation_id) {
        setConversationId(response.data.conversation_id);
      }

      if (currentAgent === "conversational") {
        setMessages(prev => [
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

  return (
    <DashboardLayout>
      <div className="generate-page">
        <div className="generate-card">
          <h1>AI Workspace</h1>
          <p>Select an AI mode and interact with NeuroForge AI.</p>

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

        {currentAgent === "engineer" && (
          <EngineerPanel result={result} />
        )}

        {currentAgent === "conversational" && (
          <ChatPanel messages={messages} />
        )}

        {currentAgent === "research" && (
          <ResearchPanel result={result} />
        )}

        {currentAgent === "education" && (
          <EducationPanel result={result} />
        )}

        {currentAgent === "automation" && (
          <AutomationPanel result={result} />
        )}
      </div>
    </DashboardLayout>
  );
}

export default GenerateProject;