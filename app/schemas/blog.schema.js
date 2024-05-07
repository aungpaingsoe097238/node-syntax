const Joi = require("joi");

const createSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  tagIds: Joi.array().items(Joi.number()).required(),
  published: Joi.boolean()
});

const updateSchema = Joi.object({
  title: Joi.string(),
  content: Joi.string(),
  tagIds: Joi.array().items(Joi.number()),
  published: Joi.boolean()
});

module.exports = {
  createSchema,
  updateSchema,
};
