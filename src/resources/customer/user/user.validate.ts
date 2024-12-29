import Joi from "joi";

const register = Joi.object({
    name: Joi.string()
        .max(30)
        .required()
        .messages({
            "string.base": "Name must be a string.",
            "string.empty": "Name cannot be empty.",
            "string.max": "Name must not exceed 30 characters.",
            "any.required": "Name is required.",
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.base": "Email must be a string.",
            "string.empty": "Email cannot be empty.",
            "string.email": "Email must be a valid email address.",
            "any.required": "Email is required.",
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.base": "Password must be a string.",
            "string.empty": "Password cannot be empty.",
            "string.min": "Password must be at least 6 characters long.",
            "any.required": "Password is required.",
        }),
});

const login = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.base": "Email must be a string.",
            "string.empty": "Email cannot be empty.",
            "string.email": "Email must be a valid email address.",
            "any.required": "Email is required.",
        }),

    password: Joi.string()
        .required()
        .messages({
            "string.base": "Password must be a string.",
            "string.empty": "Password cannot be empty.",
            "any.required": "Password is required.",
        }),
});

export default { register, login };
