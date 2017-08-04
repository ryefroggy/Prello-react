var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user.js');

var board = require('./routes/board');
var users = require('./routes/users');
// var login = require('./routes/login');
// var boards = require('./routes/boards');
var session = require('client-sessions');
var logout = require('./routes/logout');
// var denied_permission = require('./routes/denied-permission');
// var forgot_password = require('./routes/forgot_password');
// var reset_link = require('./routes/reset_link');

mongoose.connect('mongodb://localhost/prello');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookieName: 'session',
  secret: 'HairballGooseRyeFamily',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
}));

app.use(function(req, res, next) {
  if(req.session && req.session.user) {
    User.findOne({username: req.session.user.username}, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password;
        req.session.user = user;
        res.locals.user = user;
      }
      next();
    });
  }
  else {
    next();
  }
});

app.use('/board', board);
app.use('/users', users);
// app.use('/login', login);
// app.use('/boards', boards);
app.use('/logout', logout);
// app.use('/denied-permission', denied_permission);
// app.use('/forgot_password', forgot_password);
// app.use('/reset_link', reset_link);

app.get('/', function(req, res) {
  res.redirect('/boards');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
