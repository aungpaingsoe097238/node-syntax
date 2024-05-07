const update = (req, comment) => {
  return req.user.id === comment.userId;
};

const destroy = (req, comment) => {
  return req.user.id === comment.userId;
};

module.exports = {
  update,
  destroy,
};
