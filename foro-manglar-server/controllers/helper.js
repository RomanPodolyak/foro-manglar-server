// if there is an object sends it to res and returns true
exports.sendObject = function (res, obj) {
  if (obj) {
    res.status(obj.code || 416).send(obj)
  }
  return Boolean(obj)
}

// returns a simple error object to send to res
exports.generateErrorObject = function (message, code) {
  return {
    status: 'error',
    message: message,
    code: code
  }
}
