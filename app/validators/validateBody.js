const validateBody = (schema) => {
  return (req, res, next) => {
    let result = schema.validate(req.body);
    if (result.error) {
      next(new Error(result.error.details[0].message));
    } else {
      next();
    }
  };
};

module.exports = validateBody;
