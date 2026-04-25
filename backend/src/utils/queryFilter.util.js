exports.buildFilterQuery = (query, allowedFields) => {
    let whereClause = '';
    const conditions = [];
    const values = [];

    // Check if there are keys in query that match allowedFields
    allowedFields.forEach(field => {
        if (query[field]) {
            conditions.push(`${field} = ?`);
            values.push(query[field]);
        }
    });

    if (conditions.length > 0) {
        whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    return { whereClause, values };
};
