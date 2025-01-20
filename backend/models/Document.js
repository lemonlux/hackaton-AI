import mongoose from "mongoose";

const baseOptions = {
  discriminatorKey: "role",
  collection: "messages",
  timestamps: true,
};

const BaseSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
  },
  baseOptions
);

const Message = mongoose.model("Message", BaseSchema);

const AssistantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  instructions: { type: String, required: true },
  difficulty: { type: String, required: true },
  duration: { type: String, required: true },
  tags: { type: [String], required: true },
  requirements: { type: [String], required: true },
  recommendedAge: { type: String, required: true },
  prompt: { type: String, required: true },
});

const AssistantMessage = Message.discriminator("assistant", AssistantSchema);

const UserSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  newConversation: { type: Boolean, default: false },
});

const UserMessage = Message.discriminator("user", UserSchema);

export { AssistantMessage, UserMessage };
