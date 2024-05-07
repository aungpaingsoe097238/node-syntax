const update = (req, blog) => {
  return req.user.id === blog.authorId;
};

const destroy = (req, blog) => {
  return req.user.id === blog.authorId;
};

const restore = async (req, blog) => {
  return req.user.id === blog.authorId;
}

module.exports = {
  update,
  destroy,
  restore
};
