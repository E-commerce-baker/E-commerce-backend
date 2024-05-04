const productValidator = require("../utils/validator/productValidator")

exports.validateGetProductParams = (req, res, next) => {
    productValidator.chack
        (req.params, productValidator.getProductSchema, next)
}

exports.validateCreateProduct = (req, res, next) => {
    productValidator.chack
        (req.body, productValidator.createProductSchema, next)
}

exports.validateUpdateProduct = (req, res, next) => {
    productValidator.chack
        ({ ...req.params, ...req.body }, productValidator.UpdateProductSchema, next)
}
