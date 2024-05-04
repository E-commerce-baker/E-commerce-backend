const Joi = require("joi");

const { ErrorHandler } = require("../errorHandler");

exports.signupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  profileImage: Joi.string(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().min(8).equal(Joi.ref("password")),
}).options({ abortEarly: false });

exports.loginSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8).required(),
}).options({ abortEarly: false });

exports.getUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});


exports.chack = (obj, schema, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    return next(new ErrorHandler(error.message, 401));
  }
  next();
};
