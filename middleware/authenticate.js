const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET 

const authenticate = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.redirect('/')
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.redirect('/');
    }
};

module.exports = authenticate;