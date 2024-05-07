const Joi = require("joi");

const updateSchema = Joi.object({
  profileImage: Joi.string(),
  dob: Joi.string(),
  gender: Joi.string().valid("Male", "Female"),
  name: Joi.string(),
  email: Joi.string().email(),
});

module.exports = {
  updateSchema,
};
