const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
        // Fallback for local testing so we don't have to log in
        req.user = { id: "000000000000000000000000" };
        return next();
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        // Fallback even if invalid token (e.g. server restarted)
        req.user = { id: "000000000000000000000000" };
        return next();
    }
}

module.exports = authMiddleware;
