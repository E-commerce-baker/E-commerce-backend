const Joi = require('joi')
const {ErrorHandler} = require("../errorHandler")

exports.getCartSchema = Joi.object({
    id: Joi.string().hex().length(24).required()
}).options({ abortEarly: false }); 
exports.createCartSchema = Joi.object({
    name: Joi.string().min(3).trim().required()
}).options({ abortEarly: false }); 

exports.UpdateCartSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
    name: Joi.string().min(3).trim()
}).options({ abortEarly: false }); 

exports.chack = (obj, schema, next) => {
    const { error } = schema.validate(obj)
    if (error) {
        return next(new ErrorHandler(error.message, 401));
    }
    next()
}