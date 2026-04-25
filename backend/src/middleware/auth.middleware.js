const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/response.util');

module.exports = (req, res, next) => {
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    } else {
        return sendResponse(res, 401, false, "Not authorized, token missing");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains id, name, role
        next();
    } catch (error) {
        return sendResponse(res, 401, false, "Not authorized, token failed");
    }
};
