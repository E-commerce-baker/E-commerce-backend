const authValidator = require("../utils/validator/authValidator");

exports.validatesignupSchema = (req, res, next) => {
  authValidator.chack(req.body, authValidator.signupSchema, next);
};

exports.validateloginSchema = (req, res, next) => {
  authValidator.chack(req.body, authValidator.loginSchema, next);
};
