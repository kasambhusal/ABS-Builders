const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendResponse } = require('../utils/response.util');

exports.login = async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return sendResponse(res, 400, false, "Please provide name and password");
        }

        const [users] = await db.execute('SELECT * FROM users WHERE name = ?', [name]);
        if (users.length === 0) {
            return sendResponse(res, 401, false, "Invalid credentials");
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return sendResponse(res, 401, false, "Invalid credentials");
        }

        const payload = {
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
            expiresIn: process.env.JWT_EXPIRES_IN || '30d'
        });

        return sendResponse(res, 200, true, "Login successful", { token, user: payload });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error during login");
    }
};
