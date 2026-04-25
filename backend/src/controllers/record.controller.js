const db = require('../config/db');
const { sendResponse } = require('../utils/response.util');

exports.getRecords = async (req, res) => {
    try {
        const [records] = await db.execute(`
            SELECT r.*, u.name as user_name 
            FROM activity_records r
            LEFT JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
        `);
        return sendResponse(res, 200, true, "Activity records retrieved", records);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error");
    }
};
