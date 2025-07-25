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

function Verify(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).json({ message: 'Invalid credentials' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'Invalid credentials' });
    }
}



module.exports = {Authenticate, Verify};
