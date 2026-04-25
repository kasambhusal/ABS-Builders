const db = require('../config/db');
const { sendResponse } = require('../utils/response.util');
const { recordAction } = require('../services/record.service');

exports.createTestimonial = async (req, res) => {
    try {
        const { name, designation, description } = req.body;
        const image = req.file ? `/uploads/testimonials/${req.file.filename}` : null;
        
        if (!name || !description) return sendResponse(res, 400, false, "Name and description are required");

        const [result] = await db.execute(
            'INSERT INTO testimonials (name, designation, description, image) VALUES (?, ?, ?, ?)',
            [name, designation || '', description, image]
        );

        if (req.user) await recordAction(req.user.id, `Created testimonial from: ${name}`);

        return sendResponse(res, 201, true, "Testimonial created", { id: result.insertId });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error");
    }
};

exports.getTestimonials = async (req, res) => {
    try {
        const [testimonials] = await db.execute('SELECT * FROM testimonials');
        return sendResponse(res, 200, true, "Testimonials retrieved", testimonials);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error");
    }
};

exports.updateTestimonial = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, designation, description } = req.body;
        let query = 'UPDATE testimonials SET ';
        const params = [];

        if (name) { query += 'name = ?, '; params.push(name); }
        if (designation) { query += 'designation = ?, '; params.push(designation); }
        if (description) { query += 'description = ?, '; params.push(description); }
        if (req.file) { query += 'image = ?, '; params.push(`/uploads/testimonials/${req.file.filename}`); }

        if (params.length === 0) return sendResponse(res, 400, false, "No fields to update");

        query = query.slice(0, -2) + ' WHERE id = ?';
        params.push(id);

        await db.execute(query, params);
        if (req.user) await recordAction(req.user.id, `Updated testimonial ID: ${id}`);

        return sendResponse(res, 200, true, "Testimonial updated");
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error");
    }
};

exports.deleteTestimonial = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM testimonials WHERE id = ?', [id]);
        if (req.user) await recordAction(req.user.id, `Deleted testimonial ID: ${id}`);
        return sendResponse(res, 200, true, "Testimonial deleted");
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error");
    }
};
