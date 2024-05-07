const Joi = require("joi");

const createSchema = Joi.object({
  content: Joi.string().required(),
  blogId: Joi.string().required(),
});

const updateSchema = Joi.object({
  content: Joi.string()
});

module.exports = {
  createSchema,
  updateSchema,
};
