import Joi from "joi";

const createProductValidation = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Product name must be a string",
    "any.required": "Product name is required",
  }),
  quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity must be at least 0",
    "any.required": "Quantity is required",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be a positive number",
    "any.required": "Price is required",
  }),
  description: Joi.string().optional().allow(null, "").messages({
    "string.base": "Description must be a string",
  }),
  categoryId: Joi.string().required().messages({
    "string.base": "Category ID must be a string",
    "any.required": "Category ID is required",
  }),
});

const productByIdValidation = Joi.object({
  productId: Joi.string().required().messages({
    "string.base": "Product ID must be a string",
    "any.required": "Product ID is required",
  }),
});



export default { createProductValidation, productByIdValidation};