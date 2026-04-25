const db = require('../config/db');
const { sendResponse } = require('../utils/response.util');
const { recordAction } = require('../services/record.service');
const { generateSlug } = require('../services/slug.service');

exports.createProject = async (req, res) => {
    try {
        const { title, description, status, location, tags } = req.body;
        const image = req.file ? `/uploads/projects/${req.file.filename}` : null;
        
        if (!title) {
            return sendResponse(res, 400, false, "Title is required");
        }

        const slug = await generateSlug(title, 'projects');

        const [result] = await db.execute(
            'INSERT INTO projects (slug, title, description, status, image, location) VALUES (?, ?, ?, ?, ?, ?)',
            [slug, title, description, status || 'pending', image, location || '']
        );

        const projectId = result.insertId;

        if (tags) {
            let parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
            for (const tag of parsedTags) {
                let tagId;
                const [existingTag] = await db.execute('SELECT id FROM project_tags WHERE name = ?', [tag]);
                if (existingTag.length > 0) {
                    tagId = existingTag[0].id;
                } else {
                    const [newTag] = await db.execute('INSERT INTO project_tags (name) VALUES (?)', [tag]);
                    tagId = newTag.insertId;
                }
                await db.execute('INSERT INTO project_tag_map (project_id, tag_id) VALUES (?, ?)', [projectId, tagId]);
            }
        }

        if (req.user) {
            await recordAction(req.user.id, `Created project: ${title}`);
        }

        return sendResponse(res, 201, true, "Project created successfully", { id: projectId, slug });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error creating project");
    }
};

exports.getProjects = async (req, res) => {
    try {
        const { tag, location, status } = req.query;
        let query = `
            SELECT p.id, p.slug, p.title, p.description, p.image, p.location, p.status, p.published,
                   GROUP_CONCAT(pt.name) as tags
            FROM projects p
            LEFT JOIN project_tag_map ptm ON p.id = ptm.project_id
            LEFT JOIN project_tags pt ON ptm.tag_id = pt.id
        `;
        
        const conditions = [];
        const values = [];

        if (tag) {
            conditions.push(`pt.name = ?`);
            values.push(tag);
        }
        if (location) {
            conditions.push(`p.location = ?`);
            values.push(location);
        }
        if (status) {
            conditions.push(`p.status = ?`);
            values.push(status);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')} `;
        }

        query += ` GROUP BY p.id`;

        const [projects] = await db.execute(query, values);

        return sendResponse(res, 200, true, "Projects retrieved", projects);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error getting projects");
    }
};

exports.getProjectBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const [projects] = await db.execute(`
            SELECT p.*, GROUP_CONCAT(pt.name) as tags
            FROM projects p
            LEFT JOIN project_tag_map ptm ON p.id = ptm.project_id
            LEFT JOIN project_tags pt ON ptm.tag_id = pt.id
            WHERE p.slug = ?
            GROUP BY p.id
        `, [slug]);

        if (projects.length === 0 || projects[0].id === null) {
            return sendResponse(res, 404, false, "Project not found");
        }

        return sendResponse(res, 200, true, "Project retrieved", projects[0]);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error getting project");
    }
};

exports.updateProject = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, status, location } = req.body;
        
        let query = 'UPDATE projects SET ';
        const params = [];

        if (title) {
            query += 'title = ?, ';
            params.push(title);
        }
        if (description) {
            query += 'description = ?, ';
            params.push(description);
        }
        if (status) {
            query += 'status = ?, ';
            params.push(status);
        }
        if (location) {
            query += 'location = ?, ';
            params.push(location);
        }
        if (req.file) {
            query += 'image = ?, ';
            params.push(`/uploads/projects/${req.file.filename}`);
        }

        if (params.length === 0) {
             return sendResponse(res, 400, false, "No data provided to update");
        }

        query = query.slice(0, -2);
        query += ' WHERE id = ?';
        params.push(id);

        await db.execute(query, params);

        if (req.user) {
            await recordAction(req.user.id, `Updated project ID: ${id}`);
        }

        return sendResponse(res, 200, true, "Project updated successfully");
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error updating project");
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM projects WHERE id = ?', [id]);
        
        if (req.user) {
            await recordAction(req.user.id, `Deleted project ID: ${id}`);
        }

        return sendResponse(res, 200, true, "Project deleted");
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error deleting project");
    }
};
