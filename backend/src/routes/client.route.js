const express = require('express');
const router = express.Router();
const { createClient, getClients, updateClient, deleteClient } = require('../controllers/client.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const upload = require('../services/image.service');

const publicRouter = express.Router();
publicRouter.get('/', getClients);

const privateRouter = express.Router();
privateRouter.use(authMiddleware, adminMiddleware);
privateRouter.post('/', upload.single('image'), createClient);
privateRouter.get('/', getClients);
privateRouter.put('/:id', upload.single('image'), updateClient);
privateRouter.delete('/:id', deleteClient);

module.exports = { publicRouter, privateRouter };
