const Joi = require("joi");
const bcrypt = require("bcrypt");

const { ErrorHandler } = require("../errorHandler");
const { User } = require("../../models/UserModel");

exports.createUserSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  profileImage: Joi.string(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().min(8).equal(Joi.ref("password")),
}).options({ abortEarly: false });

exports.getUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

exports.UpdateUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  firstName: Joi.string(),
  lastName: Joi.string(),
  profileImage: Joi.string(),
}).options({ abortEarly: false });

exports.changePassword = Joi.object({
  id: Joi.string().hex().length(24).required(),
  currentPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().min(8).equal(Joi.ref("newPassword")).required(),
}).options({ abortEarly: false });

exports.chack = (obj, schema, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    return next(new ErrorHandler(error.message, 401));
  }
  next();
};
