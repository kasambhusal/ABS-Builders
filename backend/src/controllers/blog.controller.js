const db = require('../config/db');
const { sendResponse } = require('../utils/response.util');
const { recordAction } = require('../services/record.service');
const { generateSlug } = require('../services/slug.service');

exports.createBlog = async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const image = req.file ? `/uploads/blogs/${req.file.filename}` : null;
        
        if (!title) {
            return sendResponse(res, 400, false, "Title is required");
        }

        const slug = await generateSlug(title, 'blogs');

        const [result] = await db.execute(
            'INSERT INTO blogs (slug, title, description, image) VALUES (?, ?, ?, ?)',
            [slug, title, description, image]
        );

        const blogId = result.insertId;

        if (tags) {
            let parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
            for (const tag of parsedTags) {
                let tagId;
                const [existingTag] = await db.execute('SELECT id FROM blog_tags WHERE name = ?', [tag]);
                if (existingTag.length > 0) {
                    tagId = existingTag[0].id;
                } else {
                    const [newTag] = await db.execute('INSERT INTO blog_tags (name) VALUES (?)', [tag]);
                    tagId = newTag.insertId;
                }
                await db.execute('INSERT INTO blog_tag_map (blog_id, tag_id) VALUES (?, ?)', [blogId, tagId]);
            }
        }

        if (req.user) {
            await recordAction(req.user.id, `Created blog post: ${title}`);
        }

        return sendResponse(res, 201, true, "Blog created successfully", { id: blogId, slug });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error creating blog");
    }
};

exports.getBlogs = async (req, res) => {
    try {
        let query = `
            SELECT b.id, b.slug, b.title, b.description, b.image, b.published, b.created_at,
                   GROUP_CONCAT(bt.name) as tags
            FROM blogs b
            LEFT JOIN blog_tag_map btm ON b.id = btm.blog_id
            LEFT JOIN blog_tags bt ON btm.tag_id = bt.id
            GROUP BY b.id
        `;
        
        const [blogs] = await db.execute(query);

        return sendResponse(res, 200, true, "Blogs retrieved", blogs);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error getting blogs");
    }
};

exports.getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const [blogs] = await db.execute(`
            SELECT b.*, GROUP_CONCAT(bt.name) as tags
            FROM blogs b
            LEFT JOIN blog_tag_map btm ON b.id = btm.blog_id
            LEFT JOIN blog_tags bt ON btm.tag_id = bt.id
            WHERE b.slug = ?
            GROUP BY b.id
        `, [slug]);

        if (blogs.length === 0 || blogs[0].id === null) {
            return sendResponse(res, 404, false, "Blog not found");
        }

        return sendResponse(res, 200, true, "Blog retrieved", blogs[0]);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error getting blog");
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description } = req.body;
        
        let query = 'UPDATE blogs SET ';
        const params = [];

        if (title) {
            query += 'title = ?, ';
            params.push(title);
        }
        if (description) {
            query += 'description = ?, ';
            params.push(description);
        }
        if (req.file) {
            query += 'image = ?, ';
            params.push(`/uploads/blogs/${req.file.filename}`);
        }

        if (params.length === 0) {
             return sendResponse(res, 400, false, "No data provided to update");
        }

        query = query.slice(0, -2);
        query += ' WHERE id = ?';
        params.push(id);

        await db.execute(query, params);

        if (req.user) {
            await recordAction(req.user.id, `Updated blog ID: ${id}`);
        }

        return sendResponse(res, 200, true, "Blog updated successfully");
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error updating blog");
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM blogs WHERE id = ?', [id]);
        
        if (req.user) {
            await recordAction(req.user.id, `Deleted blog ID: ${id}`);
        }

        return sendResponse(res, 200, true, "Blog deleted");
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Server error deleting blog");
    }
};
