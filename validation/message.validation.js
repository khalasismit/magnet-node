import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message("Invalid ID format");

export const sendMessageSchema = Joi.object({
    message: Joi.string().required(),
    senderId: objectId.required(),
    receiverId: objectId.required()
});

export const createConversationSchema = Joi.object({
    userId: objectId.required(),
    otherUserId: objectId.required()
});

export const decryptMessageSchema = Joi.object({
    message: Joi.string().required()
});
