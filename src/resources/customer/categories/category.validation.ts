
import Joi from "joi";


const read = Joi.object({
  name: Joi.string().min(3).required(),
  productsId: Joi.array().items(Joi.string()).required()
})

// const readAllData = Joi.object({
//   name: Joi.string().required(),
// })

const getById = Joi.object(
  {
    id: Joi.string().min(3).required()
  }
)

const getByName = Joi.object(
  {
    name:Joi.string().min(3).required()
  }
)


export default {read, getById, getByName}