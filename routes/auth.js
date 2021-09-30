const express = require('express');
const router = express.Router();
var mid = require('../middleware');
const User = require('../models/user');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');


const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api/';
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

// let JWT_Token = '';

router.use(express.static('public'));
router.use(cookieParser());

router.get('/signup', mid.loggedOut, (req, res) => {
    res.render('signup');
});

router.post('/signup', function(req, res, next) {
    if (req.body.email && 
        req.body.name && 
        req.body.password && 
        req.body.confirmPassword) {
            
            if (req.body.password !== req.body.confirmPassword) {
                var err = new Error('Passwords do not match.');
                err.status = 400;
                return next(err);
            }
            
            // I send a post request to the API with fetch and store the data in the 'data' constant
            (async () => {
                const rawResponse = await fetch(`${base_url}auth/signup`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "secretKey": `${secretKey}`,
                    "name": req.body.name,
                    "email": req.body.email,
                    "password": req.body.password
                })
                });
                const data = await rawResponse.json();
                
                // JWT_Token = data.token;
                res.cookie('JWT_Token', data.token);

                var userData = {
                    _id: data.user._id,
                    secretKey: data.user.secretKey,
                    name: data.user.name,
                    email: data.user.email,
                    password: req.body.password,
                    createdAt: data.user.createdAt,
                    __v: data.user.__v,
                    token: data.token
                };
    
                User.create(userData, function(error, user) {
                    if (error) {
                        return next(error);
                    } else {
                        req.session.userId = user._id;
                        return res.redirect('/');
                    }
                });
            })();
    } else {
        var err = new Error('All fields are required.');
        err.status = 400;
        return next(err);
    }
});

// SignIn
router.get('/signin', mid.loggedOut, function(req, res, next) {
    return res.render('signin');
});

// How to Authenticate Users
router.post('/signin', function(req, res, next) {
    if (req.body.email && req.body.password) {

        (async () => {
            const rawResponse = await fetch(`${base_url}auth/signin`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "secretKey": `${secretKey}`,
                "email": req.body.email,
                "password": req.body.password
            })
            });
            const data = await rawResponse.json();
            
            // JWT_Token = data.token;
            res.cookie('JWT_Token', data.token);
            
            User.authenticate(req.body.email, req.body.password, function (error, user) {
                if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
                }  else {
                req.session.userId = user._id;
                return res.redirect('/');
                }
            });
        })();
    } else {
        var err = new Error('Email and password are required.');
        err.status = 401;
        return next(err);
    }
});

router.get('/signout', function(req, res, next) {
    if (req.session) {
        // Delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                res.clearCookie('JWT_Token');
                return res.redirect('/auth/signin');
            }
        });
    }
});

module.exports = router;