import express from "express";
import {
  getSessionConversations,
  loadDataSource,
  getSessionChats,
} from "../controllers/ragController.js";

const router = express.Router();

router.post("/message", loadDataSource);
router.get("/chats", getSessionChats);
router.get("/conversations", getSessionConversations);

export default router;

