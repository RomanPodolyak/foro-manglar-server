var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test');

//creates express aplication
var app = express();

// SETUP MIDDLEWARE
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// adds request logs to console
app.use(logger('dev'));

//parse request and puts it in req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// adds a cookie parser, stored in req.cookies and req.signedCookies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MIDDLEWARE


// ROUTES
// detects requests to some resources and forwards then to js files in ./routes/
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test', testRouter);

// direct processing of requests vithout routing them to other js files
//testing throwing an error
app.get('/test-error', (req, res, next) => {
  console.log("TEST ERROR PAGE REQUESTED");
  throw new Error("TEST ERROR THROWED");
});
// Fuck that favicon
app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/test/no-response', (res, req, next)=>{
  console.log("Requested /test/no-response");
});

// catch 404 and forward to error handler
// executes if no use or get with valid route caches it first before
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use((err, req, res, next)=>{
  //res.send("Uh oh...");
});

module.exports = app;
