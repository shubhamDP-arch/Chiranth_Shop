import Joi from "joi";

const read = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.base': '"name" should be a string',
      'string.min': '"name" should have at least 3 characters',
      'any.required': '"name" is required'
    }),

  productsId: Joi.array()
    .items(Joi.string())
    .required()
    .messages({
      'array.base': '"productsId" should be an array',
      'any.required': '"productsId" is required'
    })
});

const getById = Joi.object({
  id: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.base': '"id" should be a string',
      'string.min': '"id" should have at least 3 characters',
      'any.required': '"id" is required'
    })
});


const getByName = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.base': '"name" should be a string',
      'string.min': '"name" should have at least 3 characters',
      'any.required': '"name" is required'
    })
});

export default { read, getById, getByName };
