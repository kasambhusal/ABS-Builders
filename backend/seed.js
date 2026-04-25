const pool = require('./src/config/db'); // Path to your db.js
const bcrypt = require('bcryptjs'); // Or 'bcrypt' depending on what you installed

const createSuperAdmin = async () => {
    const name = 'Kasam';
    const password = 'password'; // Change this!
    const role = 1; // 1 = superadmin

    try {
        // 1. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // 2. Insert into database
        const query = 'INSERT INTO users (name, password, role) VALUES (?, ?, ?)';
        await pool.query(query, [name, hashedPassword, role]);

        console.log('✅ Superadmin created successfully!');
        process.exit();
    } catch (err) {
        console.error('❌ Error creating superadmin:', err.message);
        process.exit(1);
    }
};

createSuperAdmin();