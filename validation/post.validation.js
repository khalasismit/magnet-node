import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message("Invalid ID format");

export const createPostSchema = Joi.object({
    userId: objectId.required(),
    caption: Joi.string().max(60).allow('', null),
    fileId: objectId.required()
});

export const editPostSchema = Joi.object({
    fileId: objectId.allow('', null),
    caption: Joi.string().max(60).allow('', null)
});

export const commentSchema = Joi.object({
    userId: objectId.required(),
    comment: Joi.string().required(),
    commentId: objectId.allow('', null) // Optional parent comment ID for replies
});

export const toggleCommentLikeSchema = Joi.object({
    commentId: objectId.required(),
    userId: objectId.required()
});

export const savePostSchema = Joi.object({
    postId: objectId.required(),
    userId: objectId.required()
});
