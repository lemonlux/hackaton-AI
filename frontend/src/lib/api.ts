import axios from "axios";
type SystemMessage = {
  name: string;
  description: string;
  instructions: string;
  difficulty: string;
  duration: string;
  tags: string[];
  requirements: string[];
  recommendedAge: string;
  _id: string;
  sessionId: string;
  chatId: string;
  role: "assistant";
  prompt: string;
};

type UserMessage = {
  prompt: string;
  newConversation?: boolean;
  role: "user";
  sessionId: string;
  chatId: string;
  _id: string;
};

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/rag",
});

instance.interceptors.response.use((response) => {
  return response?.data || {};
});

export function sendMessage({
  prompt,
  chatId,
  sessionId,
  newConversation,
}: {
  prompt: string;
  chatId: string;
  sessionId: string;
  newConversation?: boolean;
}): Promise<SystemMessage> {
  return instance.post("/message", { prompt, chatId, sessionId, newConversation });
}

export function getChats({
  chatId,
  sessionId,
}: {
  chatId: string;
  sessionId: string;
}): Promise<(SystemMessage | UserMessage)[]> {
  return instance.get("/chats", { params: { chatId, sessionId } });
}

export function getConversations(sessionId: string): Promise<UserMessage[]> {
  return instance.get("/conversations", { params: { sessionId } });
}
