import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/lib/api";
import { getUserId } from "@/services/userId";
import { useParams } from "react-router-dom";

type onSucess = () => void;

function useMessages({ onSuccess }: { onSuccess: onSucess } = { onSuccess: () => {} }) {
  const { chatId = "" } = useParams<{ chatId?: string }>();
  const userId = getUserId();

  const mutation = useMutation({
    mutationFn: ({ prompt, newConversation }: { prompt: string; newConversation?: boolean }) =>
      sendMessage({ prompt, chatId, sessionId: userId, newConversation }),
    onSuccess,
  });

  const createMessage = (prompt: string, newConversation?: boolean) => {
    return mutation.mutateAsync({ prompt, newConversation });
  };

  return {
    ...mutation,
    createMessage,
  };
}

export { useMessages };
