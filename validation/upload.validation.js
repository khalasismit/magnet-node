import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message("Invalid ID format");

export const downloadFileSchema = Joi.object({
    fileId: objectId.required()
});
