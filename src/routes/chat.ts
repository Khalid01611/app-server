import express from "express";
import { isLoggedIn } from "../app/middlewares/AuthMiddlewere";
import { ChatController } from "../app/controllers/ChatController";
import { upload } from "../app/middlewares/multerMiddleware";

const router = express.Router();

// All routes require authentication
router.use(isLoggedIn);

// Conversation routes
router.get("/conversations", ChatController.getConversations as any);
router.post("/conversations", ChatController.createConversation as any);
router.get("/conversations/:conversationId", ChatController.getConversation as any);
router.put("/conversations/:conversationId", ChatController.updateConversation as any);
router.post("/conversations/:conversationId/participants", ChatController.manageParticipants as any);
router.put("/conversations/:conversationId/admins", ChatController.updateAdmins as any);

// Message routes
router.get("/conversations/:conversationId/messages", ChatController.getMessages as any);
router.get("/conversations/:conversationId/media", ChatController.getConversationMedia as any);

// Media upload route
router.post("/media", upload.single("file"), ChatController.uploadMedia as any);

// Mute/Block/Leave routes
router.put("/conversations/:conversationId/mute", ChatController.muteConversation as any);
router.put("/conversations/:conversationId/block", ChatController.blockUser as any);
router.post("/conversations/:conversationId/leave", ChatController.leaveGroup as any);
// Soft delete (hide) a conversation for current user
router.delete("/conversations/:conversationId", ChatController.deleteConversationForUser as any);

// User routes
router.get("/users/online", ChatController.getOnlineUsers as any);
router.get("/users/search", ChatController.searchUsers as any);

export default router;
