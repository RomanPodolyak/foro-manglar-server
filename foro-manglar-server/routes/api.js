var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var themeModule = require("../models/theme");

//MongoDB connection string
//mongodb://admin:asdf@localhost:27017/
let dbUserName = "admin";
let dbPassword = "asdf";
let dbLogin = false;
let dbHost = "localhost";
let dbPort = "27017";
let dbConnectionString =
  "mongodb://" +
  (dbLogin ? dbUserName + ":" + dbPassword + "@" : "") +
  dbHost +
  ":" +
  dbPort +
  "/";

//connect to MongoDB
mongoose.connect(dbConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "foroManglar",
});

let db = mongoose.connection;
//add event handlers
db.on("error", console.error.bind(console, "connection error:"));
db.on("open", function () {
  console.log("Connected to MongoDB");
});

//use this to create collections
/*
  db.createCollection("objects").catch((e) => {
    console.log("Collection alredy exists. " + e);
  });
  */

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render('index', { title: 'API DOCUMENTATION' });
});

//TEST, DELETE
router.get("/hello", function (req, res, next) {
  res.contentType("json");
  let body = { status: "OK", message: "Hello World" };
  res.send(body);
});

//TEST, return all items in a collection
router.get("/get-all/themes", function (req, res, next) {
  //res.contentType("json");

  async function query(req, res) {
    let query = themeModule
      .find({})
      .limit(parseInt(req.body.limit) || 100)
      .skip(parseInt(req.body.offset) || 0);

    let data = await query.exec();

    let body = {
      status: "OK",
      info: {
        dbConnectionString: dbConnectionString,
      },
      data: data,
    };

    console.log(data);

    res.send(body);
  }

  query(req, res).catch(function (error) {
    let body = { status: "Error", info: error + "" };
    console.log(error);
    console.log(body);
    res.send(body);
  });
});

//ADD A THEME
router.post("/test", function (req, res, next) {
  let obj = new themeModule();

  //TODO check token and get userName
  let userName = "default";
  console.log(Date.now());
  console.log(req.body.title);

  obj.type = "theme";
  obj.date = Date.now();
  obj.originalPoster = userName;
  obj.title = req.body.title;
  obj.content = req.body.content;

  console.log(obj);
  res.send(obj);

  obj.save();
});

module.exports = router;
