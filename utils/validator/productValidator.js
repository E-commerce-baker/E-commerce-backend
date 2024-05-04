const Joi = require('joi')
const { ErrorHandler } = require("../errorHandler")

exports.createProductSchema = Joi.object({
    title: Joi.string().required(),
    slug: Joi.string().lowercase(),
    description: Joi.string().required().min(20),
    quantity: Joi.number().required(),
    sold: Joi.number().default(0),
    price: Joi.number().required().min(0),
    priceAfterDiscount: Joi.number().less(Joi.ref('price')),
    colors: Joi.array().items(Joi.string()),
    imageCover: Joi.string().required(),
    images: Joi.array().items(Joi.string()),
    category: Joi.string().required(),
    subcategories: Joi.array().items(Joi.string()),
    brand: Joi.string(),
    ratingsAverage: Joi.number().min(1).max(5),
    rating: Joi.number().min(0).max(5).default(0),
}).options({ abortEarly: false }); // Allow all validation errors to be reported at once
 

exports.getProductSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
})

exports.UpdateProductSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
    title: Joi.string(),
    slug: Joi.string().lowercase(),
    description: Joi.string().min(20),
    quantity: Joi.number(),
    sold: Joi.number().default(0),
    price: Joi.number().min(0),
    priceAfterDiscount: Joi.number().less(Joi.ref('price')),
    colors: Joi.array().items(Joi.string()),
    imageCover: Joi.string(),
    image: Joi.array().items(Joi.string()),
    category: Joi.string(),
    subcategory: Joi.array().items(Joi.string()),
    brand: Joi.string(),
    ratingsAverage: Joi.number().min(1).max(5),
    rating: Joi.number().min(0).max(5).default(0),
}).options({ abortEarly: false }); // Allow all validation errors to be reported at once

exports.chack = (obj, schema, next) => {
    const { error } = schema.validate(obj)
    if (error) {
        return next(new ErrorHandler(error.message, 401));
    }
    next()
}