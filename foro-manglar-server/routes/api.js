/* eslint-disable no-unused-vars */

// TODO ckeck parent theme or post exists
// TODO implement permissions
// TODO implement search

const express = require('express')
const passport = require('passport')
const router = express.Router()
const validators = require('../controllers/validators')
const helper = require('../controllers/helper')
const getters = require('../controllers/getters')
const ThemeModel = require('../models/theme')
const PostModel = require('../models/post')
const CommentModel = require('../models/comment')
const UserModel = require('../models/user')

// CREATE
router.post('/create/theme', function (req, res, next) {
  if (!req.user) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, please log in', 401))
    return
  }
  if (validators.validate(req, res, 'title', true) ||
  validators.validate(req, res, 'description') ||
  validators.validate(req, res, 'parentTheme')) {
    return
  }

  const obj = new ThemeModel({
    parentTheme: req.body.parentTheme,
    originalPoster: req.user.username,
    title: req.body.title,
    description: req.body.description
  })

  try {
    obj.save()
  } catch (e) {
    console.log(e)
    helper.generateErrorObject(e, 500)
  }

  res.send({ status: 'ok' })
})
router.post('/create/post', function (req, res, next) {
  if (!req.user) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, please log in', 401))
    return
  }
  if (validators.validate(req, res, 'title', true) ||
  validators.validate(req, res, 'content', true) ||
  validators.validate(req, res, 'parentTheme', true)) {
    return
  }

  const obj = new PostModel({
    parentTheme: req.body.parentTheme,
    originalPoster: req.user.username,
    title: req.body.title,
    content: req.body.content
  })

  try {
    obj.save()
  } catch (e) {
    console.log(e)
    helper.generateErrorObject(e, 500)
  }

  res.send({ status: 'ok' })
})
router.post('/create/comment', function (req, res, next) {
  if (!req.user) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, please log in', 401))
    return
  }
  if (validators.validate(req, res, 'content', true) ||
    validators.validate(req, res, 'parentPost', true)) {
    return
  }

  const obj = new CommentModel({
    parentPost: req.body.parentPost,
    originalPoster: req.user.username,
    content: req.body.content
  })

  try {
    obj.save()
  } catch (e) {
    console.log(e)
    helper.generateErrorObject(e, 500)
  }

  res.send({ status: 'ok' })
})

// READ
router.get('/read/themes/all', function (req, res, next) {
  helper.getAllDocumentsByType('theme', req.body.limit, req.body.skip).then(data => {
    const obj = {
      status: 'ok',
      data: data
    }
    console.log('data.length :>> ', data.length) // TODO delete
    res.send(obj)
  })
})
router.get('/read/themes', function (req, res, next) {
  if (!validators.validate(req, res, 'parentTheme')) {
    helper.getDocumentsByParentId(req.body.parentTheme, 'theme', 'theme', false, req.body.limit, req.body.skip).then(data => {
      const obj = {
        status: 'ok',
        data: data
      }
      console.log('data.length :>> ', data.length) // TODO delete
      res.send(obj)
    })
  }
})
router.get('/read/theme', function (req, res, next) {
  if (validators.validate(req, res, 'themeId', true)) {
    return
  }
  helper.getDocumentById(req.body.themeId, 'theme').then(data => {
    console.log('data :>> ', data) // TODO delete
    const obj = {
      status: data ? 'ok' : 'error',
      data: data
    }
    res.status(data ? 200 : 500).send(obj)
  })
})

router.get('/read/posts/all', function (req, res, next) {
  helper.getAllDocumentsByType('post', req.body.limit, req.body.skip).then(data => {
    const obj = {
      status: 'ok',
      data: data
    }
    console.log('data.length :>> ', data.length) // TODO delete
    res.send(obj)
  })
})
router.get('/read/posts', function (req, res, next) {
  if (!validators.validate(req, res, 'parentTheme', true)) {
    helper.getDocumentsByParentId((req.body.parentTheme), 'post', 'theme', true, req.body.limit, req.body.skip).then(data => {
      const obj = {
        status: 'ok',
        data: data
      }
      console.log('data.length :>> ', data.length) // TODO delete
      res.send(obj)
    })
  }
})
router.get('/read/post', function (req, res, next) {
  if (validators.validate(req, res, 'postId', true)) {
    return
  }
  helper.getDocumentById(req.body.postId, 'post').then(data => {
    console.log('data :>> ', data) // TODO delete
    const obj = {
      status: data ? 'ok' : 'error',
      data: data
    }
    res.status(data ? 200 : 500).send(obj)
  })
})

router.get('/read/comments/all', function (req, res, next) {
  helper.getAllDocumentsByType('comment', req.body.limit, req.body.skip).then(data => {
    const obj = {
      status: 'ok',
      data: data
    }
    console.log('data.length :>> ', data.length) // TODO delete
    res.send(obj)
  })
})
router.get('/read/comments', function (req, res, next) {
  if (!validators.validate(req, res, 'parentPost', true)) {
    helper.getDocumentsByParentId((req.body.parentPost), 'comment', 'post', true, req.body.limit, req.body.skip).then(data => {
      const obj = {
        status: 'ok',
        data: data
      }
      console.log('data.length :>> ', data.length) // TODO delete
      res.send(obj)
    })
  }
})
router.get('/read/comment', function (req, res, next) {
  if (validators.validate(req, res, 'commentId', true)) {
    return
  }
  helper.getDocumentById(req.body.commentId, 'comment').then(data => {
    console.log('data :>> ', data) // TODO delete
    const obj = {
      status: data ? 'ok' : 'error',
      data: data
    }
    res.status(data ? 200 : 500).send(obj)
  })
})

// UPDATE
router.put('/update/theme', function (req, res, next) {
  res.send({ status: 'not implemented' })
})
router.put('/update/post', function (req, res, next) {
  res.send({ status: 'not implemented' })
})
router.put('/update/comment', function (req, res, next) {
  res.send({ status: 'not implemented' })
})

// DELETE
router.delete('/delete/theme', function (req, res, next) {
  res.send({ status: 'not implemented' })
})
router.delete('/delete/post', function (req, res, next) {
  res.send({ status: 'not implemented' })
})
router.delete('/delete/comment', function (req, res, next) {
  res.send({ status: 'not implemented' })
})

// OTHER

// show API documentation
router.get('/', function (req, res, next) {
  res.render('index', { title: 'API DOCUMENTATION' })
})

// test if API is working
router.get('/hello', function (req, res, next) {
  res.contentType('json')
  const body = { status: 'ok', message: 'Hello World' }
  res.send(body)
})

// user management
router.post('/register', function (req, res, next) {
  if (
    validators.validate(req, res, 'username', true) ||
    validators.validate(req, res, 'password', true) ||
    validators.validate(req, res, 'email', true) ||
    validators.validate(req, res, 'description')
  ) {
    return
  }

  const obj = new UserModel({
    username: req.body.username,
    enabled: true,
    userType: 'user',
    email: req.body.email,
    description: req.body.description || '',
    userConfig: {
      hideNsfwImages: true,
      darkTheme: false
    }
  })

  UserModel.register(obj, req.body.password, function (err, user) {
    if (err) {
      console.log(JSON.stringify(err, null, 2))
      return res
        .status(409)
        .send({ status: 'error', info: err.message, code: 409 })
    }
    passport.authenticate('local')(req, res, function () {
      res.send({ status: 'ok' })
    })
  })
})
router.post('/login', function (req, res, next) {
  if (validators.validate(req, res, 'username', true) || validators.validate(req, res, 'password', true)) {
    return
  }
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      console.log(err)
    }
    if (info) {
      console.log(info)
      res.status(401).send(helper.generateErrorObject('Wrong credentials', 401))
    } else {
      req.login(user, function (err) {
        if (err) {
          console.log(err)
          return res
            .status(500)
            .send({ status: 'error', info: err.message, code: 500 })
        }
        return res.send({ status: 'ok' })
      })
    }
  })(req, res, next)
})
router.post('/logout', function (req, res, next) {
  req.logout()
  res.send({
    status: 'ok'
  })
})

// TODO delete
router.get('/test', function (req, res, next) {
  res.send({
    status: 'test',
    info: {
      user: req.user,
      username: getters.getUserName(req)
    }
  })
  process.stdout.write('Username: ')
  console.log(getters.getUserName(req))
})

module.exports = router
