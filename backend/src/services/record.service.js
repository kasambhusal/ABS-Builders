const db = require('../config/db');

exports.recordAction = async (userId, title) => {
    try {
        const query = `INSERT INTO activity_records (user_id, title, created_at) VALUES (?, ?, NOW())`;
        await db.execute(query, [userId, title]);
    } catch (error) {
        console.error("Failed to insert record action: ", error);
    }
};
