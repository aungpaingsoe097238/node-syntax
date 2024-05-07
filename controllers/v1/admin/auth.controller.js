
const signIn = (req, res, next) => {
  res.send("Sign In");
};

const signUp = (req, res, next) => {
  res.send("Sign Up");
};

module.exports = {
  signIn,
  signUp,
};
