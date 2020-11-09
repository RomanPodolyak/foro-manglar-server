const helper = require('./helper')

// individual validators
exports.validateObjectId = function (objectId) {
  return /^[0-9a-f]{24}$/.test(objectId)
}
exports.validateUsername = function (username) {
  return /^[-0-9_a-zA-Z]{5,20}$/.test(username)
}
exports.validatePassword = function (password) {
  return (
    password.length >= 12 &&
      password.length <= 1000 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
  )
}
exports.validateEmail = function (email) {
  return /^[a-zA-Z0-9!#$%&’*+\-/=?^_{|}~](?:[a-zA-Z0-9!#$%&’*+\-/=?^_{|}~.][a-zA-Z0-9!#$%&’*+\-/=?^_{|}~]+)*@[a-zA-Z0-9[](?:[a-zA-Z0-9-.][a-zA-Z0-9-]+)*\.[a-zA-Z0-9-]*[a-zA-Z0-9\]]$/.test(
    email
  )
}
exports.validateDescription = function (description) {
  return description.length <= 500
}
exports.validateTitle = function (title) {
  return title.length >= 10 && title.length <= 200
}
exports.validateContent = function (content) {
  return content.length <= 5000
}

// full validator and existence checker
exports.validate = (req, res, dataType, required) => {
  const validatorsFunctions = {
    parentTheme: {
      function: this.validateObjectId,
      tip: 'only hexadecimal strings of length 24 allowed'
    },
    parentPost: {
      function: this.validateObjectId,
      tip: 'only hexadecimal strings of length 24 allowed'
    },
    parentComment: {
      function: this.validateObjectId,
      tip: 'only hexadecimal strings of length 24 allowed'
    },
    username: {
      function: this.validateUsername,
      tip: 'allowed characters: a-z, A-Z, 0-9, _. Size: 5-20'
    },
    password: {
      function: this.validatePassword,
      tip: 'required at least one of each of these characters: a-z, A-Z, 0-9. Min size: 12'
    },
    email: {
      function: this.validateEmail,
      tip: "if your email is functional but isn't accepted use another 'standard' one. Sorry for the inconvenience"
    },
    description: {
      function: this.validateDescription,
      tip: 'max size: 500'
    },
    title: {
      function: this.validateTitle,
      tip: 'size: 10-200'
    },
    content: {
      function: this.validateContent,
      tip: 'max size: 5000'
    }
  }

  let obj
  if (required && !req.body[dataType]) {
    obj = helper.generateErrorObject('No ' + dataType + ' was given', 400)
  } else if (req.body[dataType] && !validatorsFunctions[dataType].function(req.body[dataType])) {
    obj = helper.generateErrorObject('Bad ' + dataType + ', ' + validatorsFunctions[dataType].tip, 400)
  }
  return helper.sendObject(res, obj)
}
