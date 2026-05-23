import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message("Invalid ID format");

export const newNotificationSchema = Joi.object({
    senderId: objectId.required(),
    receiverId: objectId.required(),
    message: Joi.string().required(),
    postId: objectId.required()
});

export const delNotificationSchema = Joi.object({
    senderId: objectId.required(),
    receiverId: objectId.required(),
    postId: objectId.required(),
    message: Joi.string().required()
});
