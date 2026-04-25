const db = require('../config/db');
const { sendResponse } = require('../utils/response.util');
const { recordAction } = require('../services/record.service');

exports.createClient = async (req, res) => {
    try {
        const { name, url } = req.body;
        const image = req.file ? `/uploads/clients/${req.file.filename}` : null;
        
        if (!name) return sendResponse(res, 400, false, "Name is required");

        const [result] = await db.execute(
            'INSERT INTO clients (name, url, image) VALUES (?, ?, ?)',
            [name, url || '', image]
        );

        if (req.user) await recordAction(req.user.id, `Created client: ${name}`);

        return sendResponse(res, 201, true, "Client created", { id: result.insertId });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error");
    }
};

exports.getClients = async (req, res) => {
    try {
        const [clients] = await db.execute('SELECT * FROM clients');
        return sendResponse(res, 200, true, "Clients retrieved", clients);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error");
    }
};

exports.updateClient = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, url } = req.body;
        let query = 'UPDATE clients SET ';
        const params = [];

        if (name) { query += 'name = ?, '; params.push(name); }
        if (url) { query += 'url = ?, '; params.push(url); }
        if (req.file) { query += 'image = ?, '; params.push(`/uploads/clients/${req.file.filename}`); }

        if (params.length === 0) return sendResponse(res, 400, false, "No fields to update");

        query = query.slice(0, -2) + ' WHERE id = ?';
        params.push(id);

        await db.execute(query, params);
        if (req.user) await recordAction(req.user.id, `Updated client ID: ${id}`);

        return sendResponse(res, 200, true, "Client updated");
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error");
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM clients WHERE id = ?', [id]);
        if (req.user) await recordAction(req.user.id, `Deleted client ID: ${id}`);
        return sendResponse(res, 200, true, "Client deleted");
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error");
    }
};
