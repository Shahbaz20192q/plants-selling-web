var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var productsRouter = require('./routes/backend/products');
var categoryRouter = require('./routes/backend/category');
var orderRouter = require('./routes/backend/order');
var settingRouter = require('./routes/backend/settings')
var payRouter = require('./routes/backend/pay')

const adminModel = require('./server/models/adminModel')

const expressLayouts = require('express-ejs-layouts');
const flash = require('express-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const expressSession = require('express-session')
// const paymob = require('paymob');
const bodyParser = require('body-parser')

var app = express();

app.use(express.json());
app.use(bodyParser.json());

// view engine setup
app.use(expressLayouts);
app.set('layout', './layouts/User_layout');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "This is secret"
}))

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(adminModel.serializeUser())
passport.deserializeUser(adminModel.deserializeUser())


app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/products', productsRouter);
app.use('/category', categoryRouter);
app.use('/order', orderRouter);
app.use('/settings', settingRouter);
app.use('/pay', payRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
