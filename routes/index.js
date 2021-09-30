const express = require('express');
const router = express.Router();
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const app = express();
const fetch = require('node-fetch');
var XMLHttpRequest = require('xhr2');
const https = require('https');
var mid = require('../middleware');

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

router.use(express.static('public'));

// Read the name from the cookie
router.get('/', (req, res, next) => {
    res.render('index');
});



module.exports = router;