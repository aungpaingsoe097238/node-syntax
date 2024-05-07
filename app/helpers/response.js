const message = (res, status, message, code) => {
  res.status(code || 200).json({
    status,
    message,
  });
};

const success = (res, message, data, code) => {
  res.status(code || 200).json({
    status : true,
    message,
    data,
  });
};

const error = (res, message, error, code) => {
  res.status(code || 400).json({
    status : false,
    message,
    error,
  });
};

module.exports = {
  message,
  success,
  error,
};
