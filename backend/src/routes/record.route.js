const express = require('express');
const router = express.Router();
const { getRecords } = require('../controllers/record.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

router.use(authMiddleware, adminMiddleware);
router.get('/', getRecords);

module.exports = router;
