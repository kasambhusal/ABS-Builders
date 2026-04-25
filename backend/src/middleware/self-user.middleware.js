const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/response.util');

module.exports = (req, res, next) => {
    const paramId = Number(req.params.id);

    if (!Number.isInteger(paramId) || paramId <= 0) {
        return sendResponse(res, 400, false, "Invalid user id parameter");
    }

    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    } else {
        return sendResponse(res, 401, false, "Not authorized, token missing");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || Number(decoded.id) !== paramId) {
            return sendResponse(res, 403, false, "You can only update your own profile");
        }

        req.user = decoded; // Keep req.user consistent for downstream usage
        next();
    } catch (error) {
        return sendResponse(res, 401, false, "Not authorized, token failed");
    }
};
