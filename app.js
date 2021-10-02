var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categorieRouter = require('./routes/categories');
var productRouter = require('./routes/products');
var authenticationRouter = require('./routes/auth');
var cartRouter = require('./routes/cart');
var wishlistRouter = require('./routes/wishlist');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');

var app = express();

// Express Sessions
app.use(session({
	secret: 'this is a secret',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongoUrl: 'mongodb://localhost:27017/OSF-Login'
	})
}));

// Makes userId avaliable in templates
app.use(function(req, res, next) {
	res.locals.currentUser = req.session.userId;
	next();
});


// mongodb connection
mongoose.connect('mongodb://ThisIsMe:emre123@osf-project-shard-00-00.kgz4k.mongodb.net:27017,osf-project-shard-00-01.kgz4k.mongodb.net:27017,osf-project-shard-00-02.kgz4k.mongodb.net:27017/OSF-Project?ssl=true&replicaSet=atlas-zjar3u-shard-0&authSource=admin&retryWrites=true&w=majority');
var db = mongoose.connection;

// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categorieRouter);
app.use('/products', productRouter);
app.use('/auth', authenticationRouter);
app.use('/cart', cartRouter);
app.use('/wishlist', wishlistRouter);

// catch 404 and forward to error handler
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

module.exports = app;
