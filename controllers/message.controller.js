import Conversation from "../models/Conversation.model.js";
import Message from "../models/Message.model.js";
import { encryptMessage, decryptMessage } from "../services/crypto.service.js";

/*
USERID FOR TESTING
CURIOUSK : 65cb9a3572dc8e25e6485ba4
SMITK : 65cb9a4f72dc8e25e6485ba6
TESTUSER1 : 65cc410814dfd545893e5347
*/

export const decryptMessageAsync = async (req, res) => {
    try {
        const { message } = req.body;
        const decryptedMessage = decryptMessage(message);
        if (decryptedMessage) {
            return res.status(200).json(decryptedMessage);
        }
        return res.status(400).json({ message: "Invalid message" });
    } catch (err) {
        console.error("Message decryption error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

/* CREATE CONVERSATION */
export const createConversation = async (req, res) => {
    try {
        const { userId, otherUserId } = req.body;
        const existingConversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] }
        });

        if (existingConversation) {
            return res.status(200).json(existingConversation);
        }
        
        /* Create new conversation and save it */
        const newConversation = await Conversation.create({ participants: [userId, otherUserId] });
        const conversation = await newConversation.populate("participants");
        return res.status(201).json(conversation);
    } catch (err) {
        console.error("Create conversation error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

/* GET CONVERSATIONS */
export const getConversations = async (req, res) => {
    try {
        const { id } = req.params;
        let conversations = await Conversation.find({ participants: id }).sort({ updatedAt: -1 }).populate("participants messages");
        conversations = await Promise.all(conversations.map(async (conversation) => {
            const decryptedMessages = await Promise.all(conversation.messages.map(async (message) => {
                const decryptedMessage = decryptMessage(message.message);
                return {
                    ...message._doc,
                    message: decryptedMessage
                };
            }));

            return {
                ...conversation._doc,
                messages: decryptedMessages
            };
        }));
        return res.status(200).json(conversations);
    } catch (err) {
        console.error("Get conversations error:", err);
        return res.status(500).json({ error: err.message });
    }
};

export const getConversation = async (req, res) => {
    try {
        const { id } = req.params;
        const conversation = await Conversation.findOne({ _id: id }).populate("participants messages");
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        
        const decryptedMessages = await Promise.all(conversation.messages.map(async (message) => {
            const decryptedMessage = decryptMessage(message.message);
            return {
                ...message._doc,
                message: decryptedMessage
            };
        }));
        
        // Convert to plain object and replace messages with decrypted versions
        const conversationObj = conversation.toObject();
        conversationObj.messages = decryptedMessages;

        return res.status(200).json(conversationObj);
    } catch (err) {
        console.error("Get conversation error:", err);
        return res.status(500).json({ error: err.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { message, senderId, receiverId } = req.body;
        const conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });
        const encryptedMessage = encryptMessage(message);
        
        if (conversation) {
            const newMessage = new Message({
                conversationId: conversation._id,
                receiverId: receiverId,
                senderId: senderId,
                message: encryptedMessage
            });
            await newMessage.save();
            conversation.messages.push(newMessage._id);
            await conversation.save();
            const NewMessage = await Message.findOne({ _id: newMessage._id }).populate("senderId receiverId");
            return res.status(200).json({ NewMessage });
        } else {
            const newConversation = new Conversation({
                participants: [senderId, receiverId],
                messages: []
            });
            await newConversation.save();
            const newMessage = new Message({
                conversationId: newConversation._id,
                senderId: senderId,
                receiverId: receiverId,
                message: encryptedMessage
            });
            await newMessage.save();
            newConversation.messages.push(newMessage._id);
            await newConversation.save();
            const NewMessage = await Message.findOne({ _id: newMessage._id }).populate("senderId receiverId").exec();
            return res.status(200).json({ NewMessage });
        }
    } catch (err) {
        console.error("Send message error:", err);
        return res.status(500).json({ error: err.message });
    }
};

/* GET MESSAGES FOR A CONVERSATION */
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId }).populate("senderId receiverId");

        const decryptedMessages = await Promise.all(messages.map(message => {
            const decrypted = decryptMessage(message.message);
            return { ...message._doc, message: decrypted };
        }));
        return res.status(200).json(decryptedMessages);
    } catch (err) {
        console.error("Get messages error:", err);
        return res.status(500).json({ error: err.message });
    }
};

export const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        return res.status(200).json(messages);
    } catch (err) {
        console.error("Get all messages error:", err);
        return res.status(500).json({ error: err.message });
    }
};

/* GET CONVERSATIONS */
export const getAllConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find();
        return res.status(200).json(conversations);
    } catch (err) {
        console.error("Get all conversations error:", err);
        return res.status(500).json({ error: err.message });
    }
};
