const response = {
  success: (data, message = null, statusCode = 200) => ({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  }),

  error: (code, message, details = null, statusCode = 400) => ({
    success: false,
    error: {
      code,
      message,
      ...(details && { details })
    },
    timestamp: new Date().toISOString()
  })
};

module.exports = { response };