const express = require('express');
const router = express.Router();
const https = require('https');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const app = express();
const User = require('../models/user');

const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api/';
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

let Data = '';

router.use(express.static('public'));

// Sentry Set Up
Sentry.init({
    dsn: "https://f38f23aa1b864887a40bd62da2fb1457@o1001494.ingest.sentry.io/5972902",
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
});
  
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

router.get('/auth/signup', (req, res) => {
    res.render('signup');
});

router.post('/auth/signup', function(req, res, next) {
    if (req.body.email && 
        req.body.name && 
        req.body.password && 
        req.body.confirmPassword) {
            
            if (req.body.password !== req.body.confirmPassword) {
                var err = new Error('Passwords do not match.');
                err.status = 400;
                return next(err);
            }
            // Created a cookie so I can store the name
            res.cookie('name', req.body.name);

            var userData = {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                secretKey: secretKey
            };

            User.create(userData, function(error, user) {
                if (error) {
                    return next(error);
                } else {
                    req.session.userId = user._id;
                    return res.redirect('/');
                }
            });
    } else {
        var err = new Error('All fields are required.');
        err.status = 400;
        return next(err);
    }
});

// SignIn
router.get('/auth/signin', function(req, res, next) {
    return res.render('signin');
});

// This is how we authenticate a user in index.js, look at user.js too
router.post('/auth/signin', function(req, res, next) {
    if (req.body.email && req.body.password) {
      User.authenticate(req.body.email, req.body.password, function (error, user) {
        if (error || !user) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        }  else {
          req.session.userId = user._id;
          return res.redirect('/'); // /welcome is gonna be /profile
        }
      });
    } else {
      var err = new Error('Email and password are required.');
      err.status = 401;
      return next(err);
    }
});

router.get('/auth/signout', function(req, res, next) {
    if (req.session) {
        // Delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/auth/signin');
            }
        });
    }
});

// Read the name from the cookie
router.get('/', (req, res, next) => {
    let name = req.cookies.name;
    res.render('home', { name });
});



module.exports = router;