const brandValidator = require("../utils/validator/brandValidator")


exports.validateGetBrandParams = (req, res, next) => {
    brandValidator.chack
        (req.params, brandValidator.getBrandSchema, next)
}

exports.validateCreateBrand = (req, res, next) => {
    brandValidator.chack
        (req.body, brandValidator.createBrandSchema, next)
}

exports.validateUpdateBrand = (req, res, next) => {
    brandValidator.chack
        ({ ...req.params, ...req.body }, brandValidator.UpdateBrandSchema, next)
}
