const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { sendResponse } = require('../utils/response.util');
const { recordAction } = require('../services/record.service');

// Only superadmin can create users
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !password || !email) {
            return sendResponse(res, 400, false, "Name, email and password are required");
        }

        const userRole = role ? role : 2;
        const hashedPassword = await bcrypt.hash(password, 10);
        const normalizedEmail = String(email).trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return sendResponse(res, 400, false, "Invalid email format");
        }

        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, normalizedEmail, hashedPassword, userRole]
        );

        if (req.user) {
            await recordAction(req.user.id, `Created new user: ${name}`);
        }

        return sendResponse(res, 201, true, "User created successfully", { id: result.insertId });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error creating user");
    }
};

// Only superadmin can view all users
exports.getUsers = async (req, res) => {
    try {
        const userId = req.query.user_id;
        let query = 'SELECT id, name, email, role, created_at, updated_at FROM users';
        const params = [];

        if (userId) {
            query += ' WHERE id = ?';
            params.push(userId);
        }

        const [users] = await db.execute(query, params);
        return sendResponse(res, 200, true, "Users retrieved", users);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error retrieving users");
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, role, password } = req.body;
        const id = req.params.id;

        const [userCheck] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
        if (userCheck.length === 0) {
            return sendResponse(res, 404, false, "User not found");
        }

        let query = 'UPDATE users SET ';
        const params = [];

        if (name) {
            query += 'name = ?, ';
            params.push(name);
        }
        if (role) {
            query += 'role = ?, ';
            params.push(role);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += 'password = ?, ';
            params.push(hashedPassword);
        }

        if (params.length === 0) {
            return sendResponse(res, 400, false, "No fields to update");
        }

        query = query.slice(0, -2);
        query += ' WHERE id = ?';
        params.push(id);

        await db.execute(query, params);
        if (req.user) {
            await recordAction(req.user.id, `Updated user ID: ${id}`);
        }

        return sendResponse(res, 200, true, "User updated successfully");
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error updating user");
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { old_password, new_password } = req.body;
        const id = req.params.id;

        if (!old_password || !new_password) {
            return sendResponse(res, 400, false, "Old password and new password are required");
        }

        const [userCheck] = await db.execute('SELECT id, password FROM users WHERE id = ?', [id]);
        if (userCheck.length === 0) {
            return sendResponse(res, 404, false, "User not found");
        }

        const isOldPasswordValid = await bcrypt.compare(String(old_password), userCheck[0].password);
        if (!isOldPasswordValid) {
            return sendResponse(res, 400, false, "Old password is incorrect");
        }

        const hashedNewPassword = await bcrypt.hash(String(new_password), 10);
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, id]);

        if (req.user) {
            await recordAction(req.user.id, `Updated password for user ID: ${id}`);
        }

        return sendResponse(res, 200, true, "Password updated successfully");
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error updating password");
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        if (req.user) {
            await recordAction(req.user.id, `Deleted user ID: ${id}`);
        }
        return sendResponse(res, 200, true, "User deleted successfully");
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error deleting user");
    }
};
