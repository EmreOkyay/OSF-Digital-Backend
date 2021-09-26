// Custom middleware that blocks users who are logged in to see the signin or signup page through url
function loggedOut(req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/');
    }
    return next();
}

// Custom middleware that blocks users who aren't logged in to not be able to view the pages
function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return res.render('mustBeLoggedIn');
    }
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;