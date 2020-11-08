const express = require("express");
const router = express.Router();
const themeModule = require("../models/theme");
const mongooseConnection = require("../storage/mongoose-connection");
const passport = require("passport");
const user = require("../models/user");

let db = mongooseConnection.connection;
//event handlers
db.on("error", console.error.bind(console, "connection error:"));
db.on("open", function () {
  console.log("Connected to MongoDB");
});

//ROUTES
//router.post("/foobar", function (req, res, next) {res.send({ status: "not implemented" });});
//router.get("/foobar", function (req, res, next) {res.send({ status: "not implemented" });});
//router.put("/foobar", function (req, res, next) {res.send({ status: "not implemented" });});
//router.delete("/foobar", function (req, res, next) {res.send({ status: "not implemented" });});

//CREATE
router.post("/create/theme", function (req, res, next) {
  let obj = new themeModule();

  //TODO check token
  let userName = "default"; //TODO get username

  obj.date = Date.now();
  obj.originalPoster = userName; //TODO check uniqueness
  obj.title = req.body.title; //TODO check length
  obj.content = req.body.content; //TODO check length

  console.log(obj); //TODO remove debug log

  try {
    obj.save();
  } catch (e) {
    console.error(e);
    res.send({
      status: "error",
      info: e + "",
    });
  }

  res.send({
    status: "ok",
    data: obj,
  });
});
router.post("/create/post", function (req, res, next) {
  res.send({ status: "not implemented" });
});
router.post("/create/comment", function (req, res, next) {
  res.send({ status: "not implemented" });
});

//READ
router.get("/read/themes", function (req, res, next) {
  async function query(req, res) {
    let query = themeModule
      .find({})
      .limit(parseInt(req.body.limit) || 100)
      .skip(parseInt(req.body.offset) || 0);

    let data = await query.exec();

    let body = {
      status: "ok",
      data: data,
    };

    console.log(data);

    res.send(body);
  }
  query(req, res).catch(function (error) {
    let body = { status: "error", info: error + "" };
    console.log(error);
    console.log(body);
    res.send(body);
  });
});
router.get("/read/themes/all", function (req, res, next) {
  res.send({ status: "not implemented" });
});
router.get("/read/themes/:themeId", function (req, res, next) {
  res.send({ status: "not implemented" });
});
router.get("/read/theme/:themeId", function (req, res, next) {
  res.send({ status: "not implemented" });
});
router.get("/read/posts/:themeId", function (req, res, next) {
  res.send({ status: "not implemented" });
});
router.get("/read/post/:postId", function (req, res, next) {
  res.send({ status: "not implemented" });
});
router.get("/read/comments/:postId", function (req, res, next) {
  res.send({ status: "not implemented" });
});
router.get("/read/comment/:commentId", function (req, res, next) {
  res.send({ status: "not implemented" });
});

//UPDATE
router.put("/update/theme/:themeId", function (req, res, next) {
  res.send({ status: "not implemented" });
});
router.put("/update/post/:postId", function (req, res, next) {
  res.send({ status: "not implemented" });
});
router.put("/update/comment/:commentId", function (req, res, next) {
  res.send({ status: "not implemented" });
});

//DELETE
router.delete("/delete/theme/:themeId", function (req, res, next) {
  res.send({ status: "not implemented" });
});
router.delete("/delete/post/:postId", function (req, res, next) {
  res.send({ status: "not implemented" });
});
router.delete("/delete/comment/:commentId", function (req, res, next) {
  res.send({ status: "not implemented" });
});

//OTHER

//show API documentation
router.get("/", function (req, res, next) {
  res.render("index", { title: "API DOCUMENTATION" });
});

//test if API is working
router.get("/hello", function (req, res, next) {
  res.contentType("json");
  let body = { status: "ok", message: "Hello World" };
  res.send(body);
});

//user management
router.post("/register", function (req, res, next) {
  if (
    checkUsername(req, res, true) ||
    checkPassword(req, res, true) ||
    checkEmail(req, res, true) ||
    checkDescription(req, res)
  ) {
    return;
  }

  let obj = new user({
    username: req.body.username,
    enabled: true,
    userType: "user",
    email: req.body.email,
    creationDate: Date.now(),
    description: req.body.description || "",
    userConfig: {
      hideNsfwImages: true,
      darkTheme: false,
    },
  });

  user.register(obj, req.body.password, function (err, user) {
    if (err) {
      console.log(JSON.stringify(err, null, 2));
      return res
        .status(409)
        .send({ status: "error", info: err.message, code: 409 });
    }
    passport.authenticate("local")(req, res, function () {
      res.send({ status: "ok" });
    });
  });
});

router.post("/login", function (req, res, next) {
  if (checkUsername(req, res, true) || checkPassword(req, res, true)) {
    return;
  }
  passport.authenticate("local", function (err, user, info) {
    if (info) {
      console.log(info);
      res.status(401).send(getErrorObject("Wrong credentials", 401));
    } else {
      req.login(user, function (err) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .send({ status: "error", info: err.message, code: 500 });
        }
        return res.send({ status: "ok" });
      });
    }
  })(req, res, next);
});

router.post("/logout", function (req, res, next) {
  req.logout();
  res.send({
    status: "ok",
  });
});

router.get("/test", function (req, res, next) {
  res.send({
    status: "test",
    info: {
      user: req.user,
      username: getUserName(req),
    },
  });
  process.stdout.write("Username: ");
  console.log(getUserName(req));
});

//FUNCTIONS
function getUserName(req) {
  return req.user && req.user.username;
}
function getUserType(req) {
  return req.user && req.user.userType;
}

//validators
function validateUsername(username) {
  return /^[\-0-9_a-zA-Z]{5,20}$/.test(username);
}
function validatePassword(password) {
  return (
    password.length >= 12 &&
    password.length <= 1000 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
}
function validateEmail(email) {
  return /^[a-zA-Z0-9!#$%&’*+\-/=?^_{|}~](?:[a-zA-Z0-9!#$%&’*+\-/=?^_{|}~.][a-zA-Z0-9!#$%&’*+\-/=?^_{|}~]+)*@[a-zA-Z0-9\[](?:[a-zA-Z0-9-.][a-zA-Z0-9-]+)*\.[a-zA-Z0-9-]*[a-zA-Z0-9\]]$/.test(
    email
  );
}
function validateDescription(description) {
  return description.length <= 500;
}
function validateContent(content) {
  return content.length <= 5000;
}

//checkers: returns true if something doesnt exist or has bad format and sends error object. Otherwise returns false
function checkUsername(req, res, required) {
  let obj;
  if (required && !req.body.username) {
    obj = getErrorObject("No username was given", 400);
  } else if (req.body.username && !validateUsername(req.body.username)) {
    obj = getErrorObject(
      "Bad username, allowed characters: a-z, A-Z, 0-9, _. Size: 5-20",
      400
    );
  }
  return sendObject(res, obj);
}
function checkPassword(req, res, required) {
  let obj;
  if (required && !req.body.password) {
    obj = getErrorObject("No password was given", 400);
  } else if (req.body.password && !validatePassword(req.body.password)) {
    obj = getErrorObject(
      "Bad password, required at least one of each of these characters: a-z, A-Z, 0-9. Min size: 12",
      400
    );
  }
  return sendObject(res, obj);
}
function checkEmail(req, res, required) {
  let obj;
  if (required && !req.body.email) {
    obj = getErrorObject("No email was given", 400);
  } else if (req.body.email && !validateEmail(req.body.email)) {
    obj = getErrorObject(
      "Bad email format, if your email is functional but isn't accepted use another 'standard' one. Sorry for the inconvenience",
      400
    );
  }
  return sendObject(res, obj);
}
function checkDescription(req, res, required) {
  let obj;
  if (required && !res.body.description) {
    obj = getErrorObject("No description was given", 400);
  } else if (
    req.body.description &&
    !validateDescription(req.body.description)
  ) {
    obj = getErrorObject("Bad description, Max size: 500", 400);
  }
  return sendObject(res, obj);
}
function checkContent(req, res, required) {
  let obj;
  if (required && !res.body.content) {
    obj = getErrorObject("No content was given", 400);
  } else if (req.body.content && !validateContent(req.body.content)) {
    obj = getErrorObject("Bad content, Max size: 5000", 400);
  }
  return sendObject(res, obj);
}

//helpers

//if there is an object sends it to res and returns true
function sendObject(res, obj) {
  if (obj) {
    res.status(obj.code || 416).send(obj);
  }
  return Boolean(obj);
}

//returns a simple error object to send to res
function getErrorObject(message, code) {
  return {
    status: "error",
    message: message,
    code: code,
  };
}

module.exports = router;
