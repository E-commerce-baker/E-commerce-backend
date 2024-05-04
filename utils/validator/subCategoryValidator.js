const Joi = require('joi')
const {ErrorHandler} = require('../errorHandler')

exports.createSubCategorySchema = Joi.object({
    name: Joi.string().trim().min(3).required(),
    category: Joi.string().hex().length(24).required()
}).options({ abortEarly: false }); // Allow all validation errors to be reported at once

exports.getSubCategorySchema = Joi.object({
    id: Joi.string().hex().length(24).required()
}).options({ abortEarly: false }); // Allow all validation errors to be reported at once

exports.updateSubCategorySchema=Joi.object({
    id:Joi.string().hex().length(24).required(),
    name: Joi.string().trim().min(3)
}).options({ abortEarly: false }); // Allow all validation errors to be reported at once



exports.chack = (obj, schema, next) => {
    const { error } = schema.validate(obj)
    if (error) {
        next(new ErrorHandler(error.message, 400))
    }else{
        next()
    }
}