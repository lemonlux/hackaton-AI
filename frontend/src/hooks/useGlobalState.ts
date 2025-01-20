import { getUserId } from "@/services/userId";
import { useCallback, useState } from "react";
import { useChats } from "./useChats";

export function useGlobalState() {
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const sessionId = getUserId() as string;
  const pathSegments = window.location.pathname.split("/");
  const chatId = pathSegments[2];
  const { chats, refetch } = useChats({ sessionId, chatId });

  const refetchChats = useCallback(() => {
    refetch();
  }, [refetch]);

  const changeChat = useCallback((chatId: string) => {
    setCurrentChat(chatId);
  }, []);

  return {
    chats,
    currentChat,
    sessionId,
    chatId,
    refetchChats,
    changeChat,
    setCurrentChat,
  };
}
