const { sendResponse } = require('../utils/response.util');

module.exports = (req, res, next) => {
    // Allowed for both role 1 (superadmin) and 2 (admin)
    if (req.user && (req.user.role === 1 || req.user.role === 2)) {
        next();
    } else {
        return sendResponse(res, 403, false, "Not authorized as an admin");
    }
};
