const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


function Authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token)  return res.status(403).json({ message: 'Invalid credentials' });
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch {
        return res.status(403).json({ message: 'Invalid credentials' });
    }
}

module.exports = Authenticate;
