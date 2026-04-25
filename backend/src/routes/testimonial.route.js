const express = require('express');
const router = express.Router();
const { createTestimonial, getTestimonials, updateTestimonial, deleteTestimonial } = require('../controllers/testimonial.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const upload = require('../services/image.service');

// Public wrapper handles this in app.js if separated differently, but here we expect the router to be mounted on base path
// We'll export an object with two routers: publicRouter, privateRouter
const publicRouter = express.Router();
publicRouter.get('/', getTestimonials);

const privateRouter = express.Router();
privateRouter.use(authMiddleware, adminMiddleware);
privateRouter.post('/', upload.single('image'), createTestimonial);
privateRouter.get('/', getTestimonials);
privateRouter.put('/:id', upload.single('image'), updateTestimonial);
privateRouter.delete('/:id', deleteTestimonial);

module.exports = { publicRouter, privateRouter };
