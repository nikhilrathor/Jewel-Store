var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');

mongoose.connect(config.database, { useUnifiedTopology: true, useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to mongodb');
});

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

//set global eroors variable
app.locals.errors = null;

var Page = require('./models/page');

Page.find(({})).sort({ sorting: 1 }).exec(function (err, pages) {
  if (err) {
    console.log(err);
  } else {
    app.locals.pages = pages;
  }
})


var Category = require('./models/category');

Category.find(function (err, categories) {
  if (err) {
    console.log(err);
  } else {
    app.locals.categories = categories;
  }
})


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cookieParser());



app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
  //cookie: { secure: true }
}))


app.get('*', function (req, res, next) {
  res.locals.cart = req.session.cart;
  next();
});

var pages = require('./routes/pages.js');
var cart = require('./routes/cart.js');
var products = require('./routes/products.js');
var adminPages = require('./routes/admin_pages.js');
var adminCategories = require('./routes/admin_categories.js');
var adminProducts = require('./routes/admin_products.js');

app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/products', products);
app.use('/cart', cart);
app.use('/', pages);

var port = 3200;
app.listen(port, function () {
  console.log("Server started on port" + port);
})