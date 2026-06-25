import {
  createContext,
  useContext,
  useState
} from "react";
import api from "../services/api";
const ChatContext =
  createContext();

export function ChatProvider({
  children
}) {

  const [
    conversationId,
    setConversationId
  ] = useState(null);

  const [
    messages,
    setMessages
  ] = useState([]);

  const [
  selectedConversation,
  setSelectedConversation
] = useState(null);

  const [
    currentAgent,
    setCurrentAgent
  ] = useState(
    "conversational"
  );

  function newChat() {

    setConversationId(
      null
    );

    setMessages([]);

  }
  async function loadConversation(
  id
) {

  try {

    const response =
      await api.get(
        `/conversations/${id}`
      );

    setConversationId(
  id
);

console.log(
  response.data
);

setCurrentAgent(
  response.data.agent_type
);

setSelectedConversation(
  response.data
);

setMessages(
  response.data.messages || []
);

  }

  catch(error){

    console.error(
      error
    );

  }

}

  return (

    <ChatContext.Provider

      value={{

  conversationId,

  setConversationId,

  messages,

setMessages,

selectedConversation,

setSelectedConversation,

  currentAgent,

  setCurrentAgent,

  newChat,

  loadConversation

}}

    >

      {children}

    </ChatContext.Provider>

  );

}

export function useChat() {

  return useContext(
    ChatContext
  );

}