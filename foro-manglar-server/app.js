const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const favicon = require("serve-favicon");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const apiRouter = require("./routes/api");
const mongooseConnection = require("./storage/mongoose-connection");

//creates express aplication
const app = express();

//hide express tag in header
app.disable("x-powered-by");

//favicon
app.use(favicon(__dirname + "/public/favicon/favicon.ico"));

// SETUP MIDDLEWARE
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// adds request logs to console
app.use(logger("dev"));

//parse request and puts it in req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// adds a cookie parser, stored in req.cookies and req.signedCookies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//session management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    autoRemove: 'interval',
      autoRemoveInterval: 10, // In minutes
    store: new MongoStore({
      mongooseConnection: mongooseConnection.connection,
    }),
  })
);

//passportjs for login management
app.use(passport.initialize());
app.use(passport.session());

// passport config
var user = require("./models/user");
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// CUSTOM MIDDLEWARE

// ROUTES
app.use("/api", apiRouter);

// catch 404 and forward to error handler
// executes if no use or get with valid route caches it first before
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
