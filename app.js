const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

// Require the routes
const users = require('./routes/users');
const anchors = require('./routes/anchors');
const contents = require('./routes/contents');

// Start the DB
const {db} = require('./db/sequelize');

// Now start the app
var app = express();

// We use static HTML from /public instead of pug for everything except the error page
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files other than HTML
app.use(express.static(path.join(__dirname, 'public')));

// Set up the routes
app.use('/api/user', users);
app.use('/api/anchor', anchors);
app.use('/api/content', contents);

// Serve static HTML
var options = {
  dotfiles: 'ignore',
  etag: true,
  extensions: ['html'],
  index: 'index.html',
  lastModified: true,
  maxAge: '1d',
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
    res.header('Cache-Control', 'public, max-age=1d');
  }
};
app.use('/', express.static(path.join(__dirname, 'public'), options));

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
