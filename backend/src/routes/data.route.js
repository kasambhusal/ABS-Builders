const express = require('express');
const { getData, updateData } = require('../controllers/data.controller');
const authMiddleware = require('../middleware/auth.middleware');
const superadminMiddleware = require('../middleware/superadmin.middleware');

const publicRouter = express.Router();
publicRouter.get('/', getData);

const privateRouter = express.Router();
privateRouter.use(authMiddleware, superadminMiddleware);
privateRouter.put('/', updateData);
// GET data in private is not explicitly defined in requirements but useful implicitly,
// The instruction says "GET /api/public/data" and "PUT /api/private/data Only superadmin allowed."

module.exports = { publicRouter, privateRouter };
