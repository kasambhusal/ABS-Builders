const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, updateBlog, deleteBlog } = require('../controllers/blog.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const upload = require('../services/image.service');

router.use(authMiddleware);
router.use(adminMiddleware);

router.post('/', upload.single('image'), createBlog);
router.get('/', getBlogs); // Can handle filters
router.put('/:id', upload.single('image'), updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
