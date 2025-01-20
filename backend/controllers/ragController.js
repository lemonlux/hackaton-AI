import OpenAI from "openai";
import { AssistantMessage, UserMessage } from "../models/Document.js";
import { RAGApplicationBuilder, SIMPLE_MODELS } from "@llm-tools/embedjs";
import { OpenAiEmbeddings } from "@llm-tools/embedjs-openai";
import { PineconeDb } from "@llm-tools/embedjs-pinecone";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import dotenv from "dotenv";

dotenv.config();

const trainingSchema = z.object({
  name: z.string(),
  description: z.string(),
  instructions: z.string(),
  difficulty: z.string(),
  duration: z.string(),
  tags: z.array(z.string()),
  requirements: z.array(z.string()),
  recommendedAge: z.string(),
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_PROJECT_NAME = "training";
const PINECONE_NAMESPACE = "default";
const PINECONE_ENVIRONMENT = "us-east1-gcp";

let appInstance;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function initializeRAGApp() {
  if (!appInstance) {
    console.log("Initializing RAG Application...");
    appInstance = await new RAGApplicationBuilder()
      .setEmbeddingModel(new OpenAiEmbeddings({ apiKey: OPENAI_API_KEY }))
      .setModel(SIMPLE_MODELS.OPENAI_GPT4_O)
      .setVectorDatabase(
        new PineconeDb({
          projectName: PINECONE_PROJECT_NAME,
          namespace: PINECONE_NAMESPACE,
          indexSpec: {
            pod: {
              podType: "p1.x1",
              environment: PINECONE_ENVIRONMENT,
            },
          },
        })
      )
      .build();
  }
  return appInstance;
}

export const loadDataSource = async (req, res) => {
  try {
    const { prompt, sessionId, chatId, newConversation } = req.body;
    const app = await initializeRAGApp();
    UserMessage.create({
      prompt,
      sessionId,
      chatId,
      newConversation,
    });
    console.log("Querying the application...");
    //await app.addLoader(new PdfLoader({ filePathOrUrl: "../backend/assets/1.pdf" }));
    //await app.addLoader(new PdfLoader({ filePathOrUrl: "../backend/assets/2.pdf" }));
    //await app.addLoader(new PdfLoader({ filePathOrUrl: "../backend/assets/3.pdf" }));
    //await app.addLoader(new PdfLoader({ filePathOrUrl: "../backend/assets/4.pdf" }));
    // await app.addLoader(new WebLoader({ urlOrContent: 'https://www.forbes.com/profile/elon-musk' }));
    const result = await app.query(prompt);

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content:
            "Toma el rol de un entrador profesional de baloncesto. La informacion que se te proporcionara debes de redactarla nuevamente y colocar y explicar explicitamente cada paso en el campo 'instructions'",
        },
        {
          role: "user",
          content: `Redacta mejor la descripcion de estas instrucciones en el campo de instructions: ${result.content}`,
        },
      ],
      response_format: zodResponseFormat(trainingSchema, "training"),
    });

    const training = completion.choices[0].message.parsed;

    await AssistantMessage.create({ ...training, sessionId, chatId, prompt });
    res.json(completion.choices[0].message.parsed);
  } catch (error) {
    console.error("Error during query:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getSessionConversations = async (req, res) => {
  try {
    const { sessionId } = req.query;

    const conversations = await UserMessage.find({ sessionId, newConversation: true })
      .lean()
      .select("-__v");
    res.json(conversations);
  } catch (error) {
    console.error("Error during query:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getSessionChats = async (req, res) => {
  try {
    const { sessionId, chatId } = req.query;
    const [userChats, iaChats] = await Promise.all([
      UserMessage.find({ sessionId, chatId }).lean().select("-__v"),
      AssistantMessage.find({ sessionId, chatId }).lean().select("-__v"),
    ]);

    console.log({
      iaChats,
      userChats,
    });
    const chats = [...userChats, ...iaChats].sort((a, b) => a.createdAt - b.createdAt);

    res.json(chats);
  } catch (error) {
    console.error("Error during query:", error);
    res.status(500).json({ error: error.message });
  }
};
