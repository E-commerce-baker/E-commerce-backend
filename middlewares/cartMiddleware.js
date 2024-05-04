const CartValidator = require("../utils/validator/cartValidator")


exports.validateGetCartParams = (req, res, next) => {
    CartValidator.chack
        (req.params, CartValidator.getCartSchema, next)
}

exports.validateCreateCart = (req, res, next) => {
    CartValidator.chack
        (req.body, CartValidator.createCartSchema, next)
}

exports.validateUpdateCart = (req, res, next) => {
    CartValidator.chack
        ({ ...req.params, ...req.body }, CartValidator.UpdateCartSchema, next)
}
