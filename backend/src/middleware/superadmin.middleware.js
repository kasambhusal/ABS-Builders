const { sendResponse } = require('../utils/response.util');

module.exports = (req, res, next) => {
    if (req.user && req.user.role === 1) {
        next();
    } else {
        return sendResponse(res, 403, false, "Not authorized, superadmin only");
    }
};
