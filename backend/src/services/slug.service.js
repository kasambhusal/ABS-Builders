const slugify = require('slugify');
const db = require('../config/db');

exports.generateSlug = async (title, tableName) => {
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 2;

    while (true) {
        const [rows] = await db.execute(`SELECT id FROM ${tableName} WHERE slug = ?`, [slug]);
        if (rows.length === 0) {
            break;
        }
        slug = `${baseSlug}-${count}`;
        count++;
    }

    return slug;
};
