const update = (req, user) => {
  return req.user.id === user.id;
};

module.exports = {
  update,
};
