import { replace, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useGlobalStateContext } from "@/context/GlobalState";

export default function useNewConversation() {
  const navigate = useNavigate();
  const { changeChat } = useGlobalStateContext();

  const createNewChat = () => {
    const newChatId = uuidv4();
    changeChat(newChatId);
    navigate(`/chat/${newChatId}`, {
      state: {
        chatId: newChatId,
        newConversation: true,
        replace: true,
      },
    });
  };

  return createNewChat;
}
