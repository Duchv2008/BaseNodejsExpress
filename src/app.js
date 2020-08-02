var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

import bodyParser from 'body-parser';
import usersRouter from 'routes/users';
import sessionsRouter from 'routes/sessions';
import indexRouter from 'routes/index';
import blackListAccessTokenRouter from 'routes/blacklist_accesstoken';
import profileRouter from 'routes/profile.js';

require('./utils/passport.js');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());

// Body parser
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', sessionsRouter);
app.use('/', blackListAccessTokenRouter);
app.use('/profiles', profileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('app use create error 404');
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

export default app;
