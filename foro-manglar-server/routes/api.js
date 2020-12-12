/* eslint-disable no-unused-vars */

// TODO ckeck parent theme or post exists when creating post or comment
// TODO implement permissions for different type of users
// TODO implement search function
// TODO implement sort function
// TODO implement filter function
// DONE implement active/visible user/theme/post/comment
// DONE refactor deletions to make invisible instead of deleting
// TODO make something better with the hide
// TODO implement user crud
// DONE implement only OP can modify or delete
// DONE implement only logged in user can create, modify or delete
// TODO implement update password
// TODO delete childs

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
  } else if (!req.user.enabled) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, user disabled', 401))
    return
  } else if (req.user.userType !== 'admin') {
    res.status(403).send(helper.generateErrorObject('Currently only admins can create themes', 403))
  }
  if (!validators.checkValidity(req, res, 'title', true) ||
  !validators.checkValidity(req, res, 'description') ||
  !validators.checkValidity(req, res, 'parentTheme')) {
    return
  }
  validators.checkParentExists(req, res, 'theme', false)
    .then(result => {
      console.log('result :>> ', result)
      if (result) {
        const obj = new ThemeModel({
          parentTheme: req.body.parentTheme === '' ? undefined : req.body.parentTheme,
          originalPoster: req.user.username,
          visible: true,
          title: req.body.title,
          description: req.body.description
        })

        try {
          obj.save()
        } catch (e) {
          console.log(e)
          helper.generateErrorObject(e, 500)
        }

        res.send({ status: 'ok', info: { objectId: obj._id } })
      }
    })
})
router.post('/create/post', function (req, res, next) {
  if (!req.user) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, please log in', 401))
    return
  } else if (!req.user.enabled) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, user disabled', 401))
    return
  }
  if (!validators.checkValidity(req, res, 'title', true) ||
  !validators.checkValidity(req, res, 'content', true) ||
  !validators.checkValidity(req, res, 'parentTheme', true)) {
    return
  }
  validators.checkParentExists(req, res, 'post', true)
    .then(result => {
      if (result) {
        const obj = new PostModel({
          parentTheme: req.body.parentTheme,
          originalPoster: req.user.username,
          visible: true,
          title: req.body.title,
          content: req.body.content
        })

        try {
          obj.save()
        } catch (e) {
          console.log(e)
          helper.generateErrorObject(e, 500)
        }

        res.send({ status: 'ok', info: { objectId: obj._id } })
      }
    })
})
router.post('/create/comment', function (req, res, next) {
  if (!req.user) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, please log in', 401))
    return
  } else if (!req.user.enabled) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, user disabled', 401))
    return
  }
  if (!validators.checkValidity(req, res, 'content', true) ||
    !validators.checkValidity(req, res, 'parentPost', true)) {
    return
  }
  validators.checkParentExists(req, res, 'comment', true)
    .then(result => {
      if (result) {
        const obj = new CommentModel({
          parentPost: req.body.parentPost,
          originalPoster: req.user.username,
          visible: true,
          content: req.body.content
        })

        try {
          obj.save()
        } catch (e) {
          console.log(e)
          helper.generateErrorObject(e, 500)
        }

        res.send({ status: 'ok', info: { objectId: obj._id } })
      }
    })
})

// READ
// themes
// DEBUG TODO DELETE
router.get('/read/themes/all', function (req, res, next) {
  helper.getAllDocumentsByType('theme', req.query.limit, req.query.page).then(data => {
    const obj = {
      status: 'ok',
      data: data
    }
    res.send(obj)
  })
})
router.get('/read/themes/:themeId?', function (req, res, next) {
  if (validators.checkValidity({ ...req, body: { parentTheme: req.params.themeId } }, res, 'parentTheme')) {
    helper.getDocumentsByParentId(req.params.themeId, 'theme', 'theme', false, req.query.limit, req.query.page).then(data => {
      const obj = {
        status: 'ok',
        data: data
      }
      res.send(obj)
    })
  }
})
router.get('/read/theme/:themeId', function (req, res, next) {
  if (!validators.checkValidity({ ...req, body: { themeId: req.params.themeId } }, res, 'themeId', true)) {
    return
  }
  helper.getDocumentById(req.params.themeId, 'theme').then(data => {
    const obj = {
      status: data ? 'ok' : 'error',
      data: data
    }
    res.status(data ? 200 : 500).send(obj)
  })
})

// posts
router.get('/read/posts/all', function (req, res, next) {
  helper.getAllDocumentsByType('post', req.query.limit, req.query.page).then(data => {
    const obj = {
      status: 'ok',
      data: data
    }
    console.log('data.length :>> ', data.length) // TODO delete
    res.send(obj)
  })
})
router.get('/read/posts/:themeId', function (req, res, next) {
  if (validators.checkValidity({ ...req, body: { parentTheme: req.params.themeId } }, res, 'parentTheme', true)) {
    helper.getDocumentsByParentId((req.params.themeId), 'post', 'theme', true, req.query.limit, req.query.page).then(data => {
      const obj = {
        status: 'ok',
        data: data
      }
      console.log('data.length :>> ', data.length) // TODO delete
      res.send(obj)
    })
  }
})
router.get('/read/post/:postId', function (req, res, next) {
  if (!validators.checkValidity({ ...req, body: { postId: req.params.postId } }, res, 'postId', true)) {
    return
  }
  helper.getDocumentById(req.params.postId, 'post').then(data => {
    console.log('data :>> ', data) // TODO delete
    const obj = {
      status: data ? 'ok' : 'error',
      data: data
    }
    res.status(data ? 200 : 500).send(obj)
  })
})

// comments
router.get('/read/comments/all', function (req, res, next) {
  helper.getAllDocumentsByType('comment', req.query.limit, req.query.skip).then(data => {
    const obj = {
      status: 'ok',
      data: data
    }
    console.log('data.length :>> ', data.length) // TODO delete
    res.send(obj)
  })
})
router.get('/read/comments/:postId', function (req, res, next) {
  if (validators.checkValidity({ ...req, body: { parentPost: req.params.postId } }, res, 'parentPost', true)) {
    helper.getDocumentsByParentId((req.params.postId), 'comment', 'post', true, req.query.limit, req.query.page).then(data => {
      const obj = {
        status: 'ok',
        data: data
      }
      console.log('data.length :>> ', data.length) // TODO delete
      res.send(obj)
    })
  }
})
router.get('/read/comment/:commentId', function (req, res, next) {
  if (!validators.checkValidity({ ...req, body: { postId: req.params.commentId } }, res, 'commentId', true)) {
    return
  }
  helper.getDocumentById(req.params.commentId, 'comment').then(data => {
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
  if (!req.user) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, please log in', 401))
    return
  } else if (!req.user.enabled) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, user disabled', 401))
    return
  }
  if (!validators.checkValidity(req, res, 'themeId', true) ||
  !validators.checkValidity(req, res, 'description', true)) {
    return
  }
  helper.getDocumentById(req.body.themeId, 'theme').then(result => {
    if (result[0].originalPoster !== req.user.username) {
      res.status(401).send(helper.generateErrorObject('Unauthorized, not the original poster', 401))
    } else {
      ThemeModel.updateOne({ _id: req.body.themeId, visible: true }, { description: req.body.description }, (err, raw) => {
        if (err) return
        console.log('raw :>> ', raw) // TODO delete
        const obj = {
          status: raw.ok ? 'ok' : 'error',
          info: raw.ok ? raw.n ? raw.nModified ? 'successful modification' : 'nothing has been modified' : 'nothing has been found' : undefined
        }
        res.status(raw.ok ? raw.nModified ? 200 : 409 : 500).send(obj)
      })
    }
  })
})
router.put('/update/post', function (req, res, next) {
  if (!req.user) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, please log in', 401))
    return
  } else if (!req.user.enabled) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, user disabled', 401))
    return
  }
  if (!validators.checkValidity(req, res, 'postId', true) ||
    !validators.checkValidity(req, res, 'content', true)) {
    return
  }
  helper.getDocumentById(req.body.postId, 'post').then(result => {
    if (result[0].originalPoster !== req.user.username) {
      res.status(401).send(helper.generateErrorObject('Unauthorized, not the original poster', 401))
    } else {
      PostModel.updateOne({ _id: req.body.postId, visible: true }, { content: req.body.content }, (err, raw) => {
        if (err) return
        console.log('raw :>> ', raw) // TODO delete
        const obj = {
          status: raw.ok ? 'ok' : 'error',
          info: raw.ok ? raw.n ? raw.nModified ? 'successful modification' : 'nothing has been modified' : 'nothing has been found' : undefined
        }
        res.status(raw.ok ? raw.nModified ? 200 : 409 : 500).send(obj)
      })
    }
  })
})
router.put('/update/comment', function (req, res, next) {
  if (!req.user) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, please log in', 401))
    return
  } else if (!req.user.enabled) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, user disabled', 401))
    return
  }
  if (!validators.checkValidity(req, res, 'commentId', true) ||
    !validators.checkValidity(req, res, 'content', true)) {
    return
  }
  helper.getDocumentById(req.body.commentId, 'comment').then(result => {
    if (result[0].originalPoster !== req.user.username) {
      res.status(401).send(helper.generateErrorObject('Unauthorized, not the original poster', 401))
    } else {
      CommentModel.updateOne({ _id: req.body.commentId, visible: true }, { content: req.body.content }, (err, raw) => {
        if (err) return
        console.log('raw :>> ', raw) // TODO delete
        const obj = {
          status: raw.ok ? 'ok' : 'error',
          info: raw.ok ? raw.n ? raw.nModified ? 'successful modification' : 'nothing has been modified' : 'nothing has been found' : undefined
        }
        res.status(raw.ok ? raw.nModified ? 200 : 409 : 500).send(obj)
      })
    }
  })
})

// DELETE (HIDE)
router.put('/hide/theme', function (req, res, next) {
  if (!req.user) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, please log in', 401))
    return
  } else if (!req.user.enabled) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, user disabled', 401))
    return
  }
  if (!validators.checkValidity(req, res, 'themeId', true)) {
    return
  }
  helper.getDocumentById(req.body.themeId, 'theme').then(result => {
    if (result[0].originalPoster !== req.user.username) {
      res.status(401).send(helper.generateErrorObject('Unauthorized, not the original poster', 401))
    } else {
      ThemeModel.updateOne({ _id: req.body.themeId, visible: true }, { visible: false }, (err, raw) => {
        if (err) return
        console.log('raw :>> ', raw) // TODO delete
        const obj = {
          status: raw.ok ? 'ok' : 'error',
          info: raw.ok ? raw.n ? raw.nModified ? 'successful modification' : 'nothing has been modified' : 'nothing has been found' : undefined
        }
        res.status(raw.ok ? raw.nModified ? 200 : 409 : 500).send(obj)
      })
    }
  })
})
router.put('/hide/post', function (req, res, next) {
  if (!req.user) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, please log in', 401))
    return
  } else if (!req.user.enabled) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, user disabled', 401))
    return
  }
  if (!validators.checkValidity(req, res, 'postId', true)) {
    return
  }
  helper.getDocumentById(req.body.postId, 'post').then(result => {
    if (result[0].originalPoster !== req.user.username) {
      res.status(401).send(helper.generateErrorObject('Unauthorized, not the original poster', 401))
    } else {
      PostModel.updateOne({ _id: req.body.postId, visible: true }, { visible: false }, (err, raw) => {
        if (err) return
        console.log('raw :>> ', raw) // TODO delete
        const obj = {
          status: raw.ok ? 'ok' : 'error',
          info: raw.ok ? raw.n ? raw.nModified ? 'successful modification' : 'nothing has been modified' : 'nothing has been found' : undefined
        }
        res.status(raw.ok ? raw.nModified ? 200 : 409 : 500).send(obj)
      })
    }
  })
})
router.put('/hide/comment', function (req, res, next) {
  if (!req.user) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, please log in', 401))
    return
  } else if (!req.user.enabled) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, user disabled', 401))
    return
  }
  if (!validators.checkValidity(req, res, 'commentId', true)) {
    return
  }
  helper.getDocumentById(req.body.commentId, 'comment').then(result => {
    if (result[0].originalPoster !== req.user.username) {
      res.status(401).send(helper.generateErrorObject('Unauthorized, not the original poster', 401))
    } else {
      CommentModel.updateOne({ _id: req.body.commentId, visible: true }, { visible: false }, (err, raw) => {
        if (err) return
        console.log('raw :>> ', raw) // TODO delete
        const obj = {
          status: raw.ok ? 'ok' : 'error',
          info: raw.ok ? raw.n ? raw.nModified ? 'successful modification' : 'nothing has been modified' : 'nothing has been found' : undefined
        }
        res.status(raw.ok ? raw.nModified ? 200 : 409 : 500).send(obj)
      })
    }
  })
})

// DELETE (TRULY)
router.delete('/delete/theme', function (req, res, next) {
  if (!req.user) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, please log in', 401))
    return
  } else if (!req.user.enabled) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, user disabled', 401))
    return
  }
  if (!validators.checkValidity(req, res, 'themeId', true)) {
    return
  }
  helper.getDocumentById(req.body.themeId, 'theme').then(result => {
    if (result[0].originalPoster !== req.user.username) {
      res.status(401).send(helper.generateErrorObject('Unauthorized, not the original poster', 401))
    } else {
      ThemeModel.deleteOne({ _id: req.body.themeId }, (err, result) => {
        if (err) console.log(err)
        res.status(result.ok ? result.n ? 200 : 409 : 500).send({
          status: result.ok ? 'ok' : 'error',
          info: result.ok && result.n ? 'succesful deletion' : 'nothing has been found'
        })
      })
    }
  })
})
router.delete('/delete/post', function (req, res, next) {
  if (!req.user) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, please log in', 401))
    return
  } else if (!req.user.enabled) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, user disabled', 401))
    return
  }
  if (!validators.checkValidity(req, res, 'postId', true)) {
    return
  }
  helper.getDocumentById(req.body.postId, 'post').then(result => {
    if (result[0].originalPoster !== req.user.username) {
      res.status(401).send(helper.generateErrorObject('Unauthorized, not the original poster', 401))
    } else {
      PostModel.deleteOne({ _id: req.body.postId }, (err, result) => {
        if (err) console.log(err)
        res.status(result.ok ? result.deletedCount ? 200 : 409 : 500).send({
          status: result.ok ? 'ok' : 'error',
          info: result.ok && result.deletedCount ? 'succesful deletion' : 'nothing has been found'
        })
      })
    }
  })
})
router.delete('/delete/comment', function (req, res, next) {
  if (!req.user) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, please log in', 401))
    return
  } else if (!req.user.enabled) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, user disabled', 401))
    return
  }
  if (!validators.checkValidity(req, res, 'commentId', true)) {
    return
  }
  helper.getDocumentById(req.body.commentId, 'comment').then(result => {
    if (result[0].originalPoster !== req.user.username) {
      res.status(401).send(helper.generateErrorObject('Unauthorized, not the original poster', 401))
    } else {
      CommentModel.deleteOne({ _id: req.body.commentId }, (err, result) => {
        if (err) console.log(err)
        res.status(result.ok ? result.deletedCount ? 200 : 409 : 500).send({
          status: result.ok ? 'ok' : 'error',
          info: result.ok && result.deletedCount ? 'succesful deletion' : 'nothing has been found'
        })
      })
    }
  })
})

/*

helper.getDocumentById(req.body.themeId, 'theme').then(result => {
  if (result.originalPoster !== req.user.username) {
    res.status(401).send(helper.generateErrorObject('Unauthorized, not the original poster', 401))
  } else {}
})

*/

// OTHER
// show API documentation
router.get('/', function (req, res, next) {
  res.render('index', { title: 'API DOCUMENTATION' })
})

// test if API server is working
router.get('/check', function (req, res, next) {
  res.contentType('json')
  const body = { status: 'ok' }
  res.send(body)
})

// user management
router.post('/register', function (req, res, next) {
  if (
    !validators.checkValidity(req, res, 'username', true) ||
    !validators.checkValidity(req, res, 'password', true) ||
    !validators.checkValidity(req, res, 'email', true) ||
    !validators.checkValidity(req, res, 'description')
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
  if (!validators.checkValidity(req, res, 'username', true) || !validators.checkValidity(req, res, 'password', true)) {
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
router.get('/currentuser', function (req, res, next) {
  if (req.user) {
    res.send({
      status: 'ok',
      user: req.user
    })
    process.stdout.write('Username: ')
    console.log(getters.getUserName(req))
  } else {
    res.send({
      status: 'error',
      info: 'No user logged in'
    })
  }
})

module.exports = router
