import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/lib/api";
import { getUserId } from "@/services/userId";

export function useConversations() {
  const userId = getUserId();

  const { data, ...query } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(userId),
  });

  return {
    ...query,
    conversations: data,
  };
}
