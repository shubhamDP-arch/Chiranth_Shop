import Joi from "joi";

const orderNotificationValidation = Joi.object({
  customerEmail: Joi.string().email().required(),
  orderDetails: Joi.object({
    id: Joi.string().required(),
    items: Joi.array().items(Joi.string()).required(),
    total: Joi.number().required(),
  }).required(),
});

export default {
  orderNotificationValidation,
};
