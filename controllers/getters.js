exports.getUserName = function (req) {
  return req.user && req.user.username
}

exports.getUserType = function (req) {
  return req.user && req.user.userType
}
