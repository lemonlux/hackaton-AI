import Layout from "@/components/Layout";
import useNewConversation from "@/hooks/useNewConversation";

function Home() {
  const createNewChat = useNewConversation();

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center h-screen text-white">
        <h1 className="text-4xl font-bold mb-6">What can I help you with?</h1>
        <p className="text-lg text-gray-400 mb-8 text-center max-w-xl">
          BasketRAG leverages LLM and Retrieval-Augmented Generation (RAG) to create tailored
          basketball training programs. Start a chat to design your custom plan!
        </p>
        <button
          onClick={createNewChat}
          className="px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500"
        >
          Start New Chat
        </button>
      </div>
    </Layout>
  );
}

export default Home;
