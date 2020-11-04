var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apiRouter = require('./routes/api');

//creates express aplication
var app = express();

//hide express tag in header
app.disable('x-powered-by');

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
app.use('/api', apiRouter);

// Fuck that favicon
app.get('/favicon.ico', (req, res) => res.status(204));

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
