const express = require('express');
const router = express.Router();
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const app = express();
const fetch = require('node-fetch');
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();
const https = require('https');
// const JWT_Token = require('./auth.js')

router.use(express.static('public'));

const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api/';
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

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


// router.post('/cart/additem', function(request, response, next) {

// 	(async () => {
// 		const rawResponse = await fetch(`${base_url}auth/signup`, {
// 		  method: 'POST',
// 		  headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify({
// 			"secretKey": `${secretKey}`,
// 			"name": req.body.name,
// 			"email": req.body.email,
// 			"password": req.body.password
// 		})
// 		});
// 		const data = await rawResponse.json();

// 		var userData = {
// 			_id: data.user._id,
// 			secretKey: data.user.secretKey,
// 			name: data.user.name,
// 			email: data.user.email,
// 			password: req.body.password,
// 			createdAt: data.user.createdAt,
// 			__v: data.user.__v,
// 			token: data.token
// 		};

// 		User.create(userData, function(error, user) {
// 			if (error) {
// 				return next(error);
// 			} else {
// 				req.session.userId = user._id;
// 				return res.redirect('/');
// 			}
// 		});
// 	})();
// });

// Read the name from the cookie
router.get('/', (req, res, next) => {
    let name = req.cookies.name;
    res.render('index', { name });
});



module.exports = router;