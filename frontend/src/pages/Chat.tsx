import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useMessages } from "@/hooks/useMessages";
import { ChevronUp, Copy, RotateCcw, Timer, AudioLines, User } from "lucide-react";
import { useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalStateContext } from "@/context/GlobalState";

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
  _id: string;
};

export default function Chat() {
  const { chats, refetchChats } = useGlobalStateContext();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const { state, ...locationState } = useLocation();
  const { newConversation = false } = state || {};

  const prevPromptRef = useRef<null | string>(null);
  const { createMessage, isPending, isError, error } = useMessages({
    onSuccess: refetchChats,
  });

  const retry = (prompt?: string) => {
    const message = prevPromptRef.current || prompt;
    if (message) {
      createMessage(message);
      setInput(message);
      prevPromptRef.current = message;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (prompt) {
      await createMessage(prompt, newConversation);

      setInput("");
      prevPromptRef.current = prompt;
      navigate(locationState.pathname, { state: null });
    }
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          {chats.map((message: SystemMessage | UserMessage) => (
            <div key={message._id} className="mb-6">
              {message.role === "user" ? (
                <div className="bg-neutral-900 text-neutral-100 p-4 rounded-2xl max-w-2xl ml-auto border border-neutral-800">
                  {message.prompt}
                </div>
              ) : (
                <div className="bg-neutral-900 p-4 rounded-2xl max-w-2xl border border-neutral-800">
                  <div className="flex gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  </div>

                  <section>
                    <h3 className="font-semibold text-lg text-center text-balance px-10">
                      {message?.name}
                    </h3>

                    <div className="flex gap-5 justify-center mt-2">
                      <span className="text-gray-400	 text-sm flex items-center gap-2">
                        <Timer className="h-4 w-4 inline-block" />
                        <span>{message?.duration}</span>
                      </span>

                      <span className="text-gray-400	 text-sm flex items-center gap-2">
                        <AudioLines className="h-4 w-4 inline-block" />
                        <span>{message?.difficulty}</span>
                      </span>

                      <span className="text-gray-400	 text-sm flex items-center gap-2">
                        <User className="h-4 w-4 inline-block" />
                        <span>{message?.recommendedAge}</span>
                      </span>
                    </div>
                  

                    {message?.requirements?.length > 0 && (
                      <div className="flex gap-1 mt-5 mb-10 justify-center">
                        {message?.requirements.map((req) => (
                          <div
                            key={req}
                            className="bg-neutral-800 py-2 px-3 rounded-md max-w-2xl border border-neutral-900"
                          >
                            <span className="font-semibold text-xs line-clamp-2 text-center">
                              {req}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-sm markdown">
                      <Markdown remarkPlugins={[remarkGfm]}>{message.instructions}</Markdown>
                    </div>
                    {message?.tags?.length > 0 && (
                      <div className="flex gap-2 mt-4">
                        {message.tags.map((tag) => (
                          <Badge key={tag} className="text-center">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </section>

                  <div className="flex gap-2 mt-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => retry(message.prompt)}
                      disabled={isPending}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </ScrollArea>

        <div className="px-6 py-3 bg-black/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="relative max-w-5xl mx-auto">
            <Input
              disabled={isPending}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message ChatGPT..."
              className="pr-16 bg-neutral-900 border-neutral-800 rounded-xl focus:ring-neutral-700 transition-colors"
            />
            <Button
              loading={isPending}
              disabled={isPending}
              type="submit"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
            >
              {!isPending && <ChevronUp className="h-4 w-4" />}
            </Button>
          </form>
          <div className="text-center mt-3 text-xs text-neutral-500">
            ChatGPT may produce inaccurate information about people, places, or facts.
          </div>
        </div>
      </div>
    </Layout>
  );
}
