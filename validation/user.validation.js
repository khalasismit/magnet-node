import Joi from "joi";

export const editUserSchema = Joi.object({
    firstName: Joi.string().min(3).max(50).allow('', null),
    lastName: Joi.string().min(3).max(50).allow('', null),
    userName: Joi.string().max(25).allow('', null),
    location: Joi.string().max(50).allow('', null),
    bio: Joi.string().max(60).allow('', null),
    picturePath: Joi.string().allow('', null),
    email: Joi.string().email().max(50).allow('', null)
});
