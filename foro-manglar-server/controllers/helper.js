const validators = require('./validators')

const models = {
  theme: require('../models/theme'),
  post: require('../models/post'),
  comment: require('../models/comment'),
  user: require('../models/user')
}

/** if there is an object sends it to res and returns true */
exports.sendObject = function (res, obj) {
  if (obj) {
    res.status(obj.code || 416).send(obj)
  }
  return Boolean(obj)
}

/** returns a simple error object to send to res */
exports.generateErrorObject = function (message, code) {
  return {
    status: 'error',
    message: message,
    code: code
  }
}

exports.stringToId = function (str) {
  return str + 'Id'
}

exports.stringToParent = function (str) {
  return 'parent' + str.charAt(0).toUpperCase() + str.slice(1)
}

/** returns document promise using id and model type */
exports.getDocumentById = function (id, type) {
  if (validators.validateObjectId(id)) {
    return models[type].find({ _id: id }).exec()
  } else {
    console.log('objectId not valid')
  }
}

/** returns array of documents promise using id and model type.
 * A required flag can be set. A custom limit and offset can be added */
exports.getDocumentsByParentId = function (id, type, parentType, required, limit, offset) {
  if (required && !validators.validateObjectId(id)) {
    console.log('objectId not valid')
    return
  }
  return models[type]
    .find({ [this.stringToParent(parentType)]: id !== '' ? id : undefined })
    .limit(parseInt(limit) || 100)
    .skip(parseInt(offset) || 0)
    .exec()
}

exports.getAllDocumentsByType = function (type, limit, offset) {
  return models[type]
    .find({})
    .limit(parseInt(limit) || 100)
    .skip(parseInt(offset) || 0)
    .exec()
}

/** returns boolean promise depending if document with id and model type exists */
exports.documentExists = function (id, type) {
  const result = this.getDocumentById(id, type).then((document) => {
    return Boolean(document.length)
  })
  return result
}
