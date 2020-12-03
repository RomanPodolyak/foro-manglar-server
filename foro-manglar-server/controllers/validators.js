const helper = require('./helper')

// individual validators
exports.validateObjectId = function (objectId) {
  return /^[0-9a-f]{24}$/.test(objectId)
}
exports.validateUsername = function (username) {
  return /^[-0-9_a-zA-ZáéíóúñüÁÉÍÓÚÑÜ]{5,24}$/.test(username)
}
exports.validatePassword = function (password) {
  return (
    password.length >= 10 &&
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

/** generic validator and existence checker */
exports.checkValidity = (req, res, type, required, name) => {
  const validatorsFunctions = {
    objectId: {
      function: this.validateObjectId,
      tip: 'only hexadecimal strings of length 24 allowed'
    },
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
    themeId: {
      function: this.validateObjectId,
      tip: 'only hexadecimal strings of length 24 allowed'
    },
    postId: {
      function: this.validateObjectId,
      tip: 'only hexadecimal strings of length 24 allowed'
    },
    commentId: {
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
  if (required && !req.body[type]) {
    obj = helper.generateErrorObject('No ' + (name || type) + ' was given', 400)
  } else if (req.body[type] && !validatorsFunctions[type].function(req.body[type])) {
    obj = helper.generateErrorObject('Bad ' + (name || type) + ', ' + validatorsFunctions[type].tip, 400)
  }
  return !helper.sendObject(res, obj)
}

/** returns bool promise depending on parent existence */
exports.checkParentExists = (req, res, type, required) => {
  const typesToParent = {
    theme: 'theme',
    post: 'theme',
    comment: 'post'
  }
  return helper.models[typesToParent[type]]
    .find({
      _id: req.body[helper.stringToParent(typesToParent[type])] === '' ? 'aaaaaaaaaaaaaaaaaaaaaaaa' : req.body[helper.stringToParent(typesToParent[type])],
      inexistent: req.body[helper.stringToParent(typesToParent[type])] === '' ? true : undefined
    })
    .exec()
    .then(result => {
      if (!required && !req.body[helper.stringToParent(typesToParent[type])]) {
        return true
      } else if (!result.length) {
        res.status(400).send(helper.generateErrorObject("Parent object doesn't exist", 400))
        return false
      } else {
        return true
      }
    })
}
