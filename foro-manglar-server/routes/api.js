/* eslint-disable no-unused-vars */

// TODO ckeck parent theme or post exists
const express = require('express')
const mongooseConnection = require('../controllers/mongoose-connection')
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
router.get('/read/themes', function (req, res, next) {
  async function query (req, res) {
    const query = ThemeModel.find({})
      .limit(parseInt(req.body.limit) || 100)
      .skip(parseInt(req.body.offset) || 0)

    const data = await query.exec()

    const body = {
      status: 'ok',
      data: data
    }

    console.log(data)

    res.send(body)
  }
  query(req, res).catch(function (error) {
    const body = { status: 'error', info: error + '' }
    console.log(error)
    console.log(body)
    res.send(body)
  })
})
router.get('/read/themes/all', function (req, res, next) {
  res.send({ status: 'not implemented' })
})
router.get('/read/themes/:themeId', function (req, res, next) {
  res.send({ status: 'not implemented' })
})
router.get('/read/theme/:themeId', function (req, res, next) {
  res.send({ status: 'not implemented' })
})
router.get('/read/posts/:themeId', function (req, res, next) {
  res.send({ status: 'not implemented' })
})
router.get('/read/post/:postId', function (req, res, next) {
  res.send({ status: 'not implemented' })
})
router.get('/read/comments/:postId', function (req, res, next) {
  res.send({ status: 'not implemented' })
})
router.get('/read/comment/:commentId', function (req, res, next) {
  res.send({ status: 'not implemented' })
})

// UPDATE
router.put('/update/theme/:themeId', function (req, res, next) {
  res.send({ status: 'not implemented' })
})
router.put('/update/post/:postId', function (req, res, next) {
  res.send({ status: 'not implemented' })
})
router.put('/update/comment/:commentId', function (req, res, next) {
  res.send({ status: 'not implemented' })
})

// DELETE
router.delete('/delete/theme/:themeId', function (req, res, next) {
  res.send({ status: 'not implemented' })
})
router.delete('/delete/post/:postId', function (req, res, next) {
  res.send({ status: 'not implemented' })
})
router.delete('/delete/comment/:commentId', function (req, res, next) {
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
