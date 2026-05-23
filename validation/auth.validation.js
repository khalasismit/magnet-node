import Joi from "joi";

// Reusable validation helpers
const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message("Invalid ID format");

export const signupSchema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    userName: Joi.string().max(25).required(),
    dob: Joi.date().required(),
    location: Joi.string().max(50).allow('', null),
    bio: Joi.string().max(60).allow('', null),
    picturePath: Joi.string().allow('', null),
    email: Joi.string().email().max(50).required(),
    password: Joi.string().min(5).required(),
    status: Joi.boolean().default(false),
    followers: Joi.array().items(objectId).default([]),
    following: Joi.array().items(objectId).default([]),
    followRequest: Joi.array().items(objectId).default([]),
    sentRequest: Joi.array().items(objectId).default([]),
    posts: Joi.array().items(objectId).default([]),
    savedPosts: Joi.array().items(objectId).default([])
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const continueWithGoogleSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userName: Joi.string().required(),
    dob: Joi.date().allow('', null),
    bio: Joi.string().max(60).allow('', null),
    location: Joi.string().max(50).allow('', null),
    picturePath: Joi.string().allow('', null),
    email: Joi.string().email().required(),
    status: Joi.boolean().default(false),
    followers: Joi.array().items(objectId).default([]),
    following: Joi.array().items(objectId).default([]),
    followRequest: Joi.array().items(objectId).default([]),
    sentRequest: Joi.array().items(objectId).default([]),
    posts: Joi.array().items(objectId).default([]),
    savedPosts: Joi.array().items(objectId).default([])
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

export const resetPasswordSchema = Joi.object({
    password: Joi.string().min(5).required()
});
