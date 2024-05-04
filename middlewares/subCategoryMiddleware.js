const subCategoryValidator = require("../utils/validator/subCategoryValidator")

exports.getSubCategoryParams = (req, res, next) => {
    subCategoryValidator.chack
        (req.params, subCategoryValidator.getSubCategorySchema, next)
}

exports.createSubCategory = (req, res, next) => {
    subCategoryValidator.chack
        (req.body, subCategoryValidator.createSubCategorySchema, next)
}
exports.updateSubCategory = (req, res, next) => {
    subCategoryValidator.chack
        ({...req.params, ...req.body }, subCategoryValidator.updateSubCategorySchema, next)
}
