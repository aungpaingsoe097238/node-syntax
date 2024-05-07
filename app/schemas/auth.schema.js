const Joi = require("joi");

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signUpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  password_confirmation: Joi.valid(Joi.ref("password")).required(),
});

module.exports = {
  signInSchema,
  signUpSchema,
};
