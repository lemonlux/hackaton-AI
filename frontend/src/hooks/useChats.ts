import { useQuery } from "@tanstack/react-query";
import { getChats } from "@/lib/api";

export function useChats({ sessionId, chatId }: { sessionId: string; chatId: string }) {
  const { data, ...query } = useQuery({
    queryKey: ["chats", sessionId, chatId],
    queryFn: () => getChats({ sessionId, chatId }),
    enabled: !!sessionId && !!chatId,
  });

  return {
    ...query,
    chats: data ?? [],
  };
}
