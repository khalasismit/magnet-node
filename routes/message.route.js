import express from "express";
import { 
    createConversation, 
    decryptMessageAsync, 
    getAllConversations, 
    getAllMessages, 
    getConversation, 
    getConversations, 
    getMessages, 
    sendMessage 
} from "../controllers/message.controller.js";
import { validateRequest } from "../validation/validate.middleware.js";
import { 
    createConversationSchema, 
    sendMessageSchema, 
    decryptMessageSchema 
} from "../validation/message.validation.js";

const router = express.Router();

router.post('/conversation/create', validateRequest(createConversationSchema), createConversation);
router.get('/:id', getConversation);
router.get('/:id/conversations', getConversations);
router.get('/:conversationId/messages', getMessages);
router.post("/message/decrypt", validateRequest(decryptMessageSchema), decryptMessageAsync);
router.post('/message/new', validateRequest(sendMessageSchema), sendMessage);
router.get('/messages/all', getAllMessages);
router.get('/', getAllConversations);

export default router;
