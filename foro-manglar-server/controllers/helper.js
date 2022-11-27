// TODO checkUser(req, res, objectId?, type?)

const validators = require('./validators')

exports.models = {
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
    return this.models[type].find({ _id: id, visible: true }).exec()
  } else {
    console.error('objectId not valid')
  }
}

/** returns array of documents promise using id and model type.
 * A required flag can be set. A custom limit and offset can be added */
exports.getDocumentsByParentId = function (id, type, parentType, required, limit, page) {
  if (required && !validators.validateObjectId(id)) {
    console.error('objectId not valid')
    return
  }
  return this.models[type]
    .find({ [this.stringToParent(parentType)]: id !== '' ? id : undefined, visible: true })
    .limit(parseInt(limit) || 100)
    .skip(parseInt(page * limit) || 0)
    .exec()
}

// TODO delete
/** DEBUG!!! returns all documents from a specific type, visible or not */
exports.getAllDocumentsByType = function (type, limit, page) {
  return this.models[type]
    .find({})
    .limit(parseInt(limit) || 100)
    .skip(parseInt(page * limit) || 0)
    .exec()
}

/** returns boolean promise depending if document with id and model type exists */
exports.documentExists = function (id, type) {
  const result = this.getDocumentById(id, type).then((document) => {
    return Boolean(document.length)
  })
  return result
}
