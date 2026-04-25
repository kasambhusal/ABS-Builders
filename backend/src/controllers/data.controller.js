const db = require('../config/db');
const { sendResponse } = require('../utils/response.util');
const { recordAction } = require('../services/record.service');

exports.getData = async (req, res) => {
    try {
        const [data] = await db.execute('SELECT * FROM site_data LIMIT 1');
        return sendResponse(res, 200, true, "Site data retrieved", data[0] || {});
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error");
    }
};

exports.updateData = async (req, res) => {
    try {
        const { projects, offices, turnover, staffs } = req.body;
        
        let query = 'UPDATE site_data SET ';
        const params = [];

        if (projects !== undefined) { query += 'projects = ?, '; params.push(projects); }
        if (offices !== undefined) { query += 'offices = ?, '; params.push(offices); }
        if (turnover !== undefined) { query += 'turnover = ?, '; params.push(turnover); }
        if (staffs !== undefined) { query += 'staffs = ?, '; params.push(staffs); }

        if (params.length === 0) return sendResponse(res, 400, false, "No fields to update");

        query = query.slice(0, -2);
        
        await db.execute(query, params);
        if (req.user) await recordAction(req.user.id, `Updated site data`);

        return sendResponse(res, 200, true, "Site data updated successfully");
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error");
    }
};
