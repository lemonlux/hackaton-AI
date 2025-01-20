import { Button } from "@/components/ui/button";
import { MoreVertical, Plus, Search, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import NavbarComponent from "./navbarComponent";
import { useConversations } from "@/hooks/useConversations";
import { Link } from "react-router-dom";
import useNewConversation from "@/hooks/useNewConversation";
import { useGlobalStateContext } from "@/context/GlobalState";
import { useNavigate } from "react-router-dom";
import { getShortText } from "@/lib/utils";
import { useEffect, useState } from "react";
import { normalizeText } from "@/lib/utils";

type UserMessage = {
  prompt: string;
  newConversation?: boolean;
  role: "user";
  sessionId: string;
  chatId: string;
  _id: string;
};

export default function Navbar() {
  const { conversations } = useConversations();
  const { changeChat } = useGlobalStateContext();
  const createNewChat = useNewConversation();
  const navigate = useNavigate();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [filteredConversations, setFilteredConversations] = useState<UserMessage[]>(
    conversations || []
  );

  const createNewChatWrapper = (chatId: string) => {
    changeChat(chatId);
    navigate(`/chat/${chatId}`, { replace: true });
  };

  const onChangeConversation = (chatId: string) => {
    createNewChatWrapper(chatId);
    setActiveConversation(chatId);
  };

  const createNewChatReset = () => {
    setActiveConversation(null);
    createNewChat();
  };

  const onFilterConversations = (search: string) => {
    if (search === "") {
      setFilteredConversations(conversations as UserMessage[]);
      return;
    }
    console.log({ search });
    const filtered = conversations?.filter((conversation) => {
      const searchWords = normalizeText(search.toLocaleLowerCase()).split(" ");
      const normalizedPrompt = normalizeText(conversation.prompt.toLocaleLowerCase());

      // Comprobar si todas las palabras de búsqueda están en el prompt
      return searchWords.every((word) => normalizedPrompt.includes(word));
    });

    console.log({ filtered });
    setFilteredConversations(filtered as UserMessage[]);
  };

  useEffect(() => {
    if (conversations?.length) {
      setFilteredConversations(conversations as UserMessage[]);
    }
  }, [conversations]);

  return (
    <div className="w-80 border-r border-neutral-800 flex flex-col bg-black">
      <div className="p-4 ">
        <Link className="flex items-center gap-2 mb-4" to="/">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="font-semibold">BasketRAG</div>
          <div className="text-xs text-gray-500">VERSION 1.0</div>
        </Link>
        <div className="relative">
          <Search className="absolute left-2 top-4 h-4 w-4 text-gray-500" />
          <Input
            onChange={(e) => onFilterConversations(e.target.value)}
            placeholder="Search"
            className="pl-8 bg-neutral-900 border-neutral-800 rounded-xl focus:ring-neutral-700 transition-colors"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={createNewChatReset}
                  className="w-full justify-start gap-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 rounded-xl transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create a new chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {filteredConversations?.map((conversation) => (
            <NavbarComponent
              key={conversation._id}
              onClick={() => onChangeConversation(conversation.chatId)}
              isActive={activeConversation === conversation.chatId}
            >
              <MessageSquare />
              {getShortText(conversation.prompt, 30)}
            </NavbarComponent>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 rounded-xl transition-colors"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span>User Account</span>
          <MoreVertical className="h-4 w-4 ml-auto" />
        </Button>
      </div>
    </div>
  );
}