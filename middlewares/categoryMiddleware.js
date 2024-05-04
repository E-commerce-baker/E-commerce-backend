const categoryValidator = require("../utils/validator/categoryValidator")

exports.validateGetCategoryParams = (req, res, next) => {
    categoryValidator.chack
        (req.params, categoryValidator.getCategorySchema, next)
}

exports.validateCreateCategory = (req, res, next) => {
    categoryValidator.chack
        (req.body, categoryValidator.createCategorySchema, next)
}

exports.validateUpdateCategory = (req, res, next) => {
    categoryValidator.chack
        ({ ...req.params, ...req.body }, categoryValidator.UpdateCategorySchema, next)
}
