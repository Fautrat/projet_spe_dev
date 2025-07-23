const Tokens = require('csrf');

const tokens = new Tokens();
let csrfSecret = tokens.secretSync();

function CSRF(req, res, next) {
    console.log('CSRF Middleware triggered');
    if (req.method === 'GET') {
        const token = tokens.create(csrfSecret);
        res.cookie('XSRF-TOKEN', token);
        return next();
    }

    const token = req.headers['x-xsrf-token'];
    if (!token || !tokens.verify(csrfSecret, token)) {
        return res.status(419).json({ error: 'Invalid CSRF token' });
    }

  next();
}
module.exports = CSRF;