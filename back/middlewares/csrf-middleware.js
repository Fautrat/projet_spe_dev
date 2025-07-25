const jwt = require('jsonwebtoken');
const Tokens = require('csrf');
const tokens = new Tokens();

function CSRF(req, res, next) {

    console.log("CSRF triggered");
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const jwtToken = req.cookies['token'];
    const csrfToken = req.headers['x-csrf-token'];

    if (!jwtToken || !csrfToken) {
        return res.status(419).json({ error: 'Missing token' });
    }

    try {
        console.log(csrfToken);
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        console.log(csrfToken);
        console.log(decoded.csrfSecret);
        const valid = tokens.verify(decoded.csrfSecret, csrfToken);

        if (!valid) {
        return res.status(419).json({ error: 'Invalid CSRF token' });
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = CSRF;