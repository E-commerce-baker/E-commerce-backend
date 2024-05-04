const Joi = require('joi')
const {ErrorHandler} = require("../errorHandler")

exports.getBrandSchema = Joi.object({
    id: Joi.string().hex().length(24).required()
}).options({ abortEarly: false }); // Allow all validation errors to be reported at once
exports.createBrandSchema = Joi.object({
    name: Joi.string().min(3).trim().required(),
    image : Joi.string()
}).options({ abortEarly: false }); 

exports.UpdateBrandSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  name: Joi.string().min(3).trim(),
  image: Joi.string(),
}).options({ abortEarly: false }); 

exports.chack = (obj, schema, next) => {
    const { error } = schema.validate(obj)
    if (error) {
        return next(new ErrorHandler(error.message, 401));
    }
    next()
}