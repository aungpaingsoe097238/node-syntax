const asyncMiddleware = (fun) => {
  return (req, res, next) => {
    return new Promise((resolve, reject) => {
      Promise.resolve(fun(req, res, next))
        .then(resolve) 
        .catch(reject);
    });
  };
};

module.exports = asyncMiddleware;