const express = require('express');
const router = express.Router();
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const app = express();

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

router.use(express.static('public'));

router.get('/', (req, res, next) => {
    res.render('index');
});



module.exports = router;