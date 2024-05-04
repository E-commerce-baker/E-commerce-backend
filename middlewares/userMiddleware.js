const UserValidator = require("../utils/validator/userValidator");

exports.validateGetUserParams = (req, res, next) => {
  UserValidator.chack(req.params, UserValidator.getUserSchema, next);
};

exports.validateCreateUser = (req, res, next) => {
  UserValidator.chack(req.body, UserValidator.createUserSchema, next);
};

exports.validateUpdateUser = (req, res, next) => {
  UserValidator.chack(
    { ...req.params, ...req.body },
    UserValidator.UpdateUserSchema,
    next
  );
};

exports.changePassword = (req, res, next) => {
  UserValidator.chack(
    { ...req.params, ...req.body },
    UserValidator.changePassword,
    next
  );
};
