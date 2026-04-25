const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security and utility mechanisms
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors());

// Rate limiting (Basic security setup)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
// Static folder for uploads
// Note: In production when migrating to S3 or Cloudinary, this may be removed or replaced
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Import Routes
const userPublicRoutes = require('./routes/user.public.route');
const userPrivateRoutes = require('./routes/user.private.route');
const projectPublicRoutes = require('./routes/project.public.route');
const projectPrivateRoutes = require('./routes/project.private.route');
const blogPublicRoutes = require('./routes/blog.public.route');
const blogPrivateRoutes = require('./routes/blog.private.route');
const testimonialRoutes = require('./routes/testimonial.route');
const clientRoutes = require('./routes/client.route');
const dataRoutes = require('./routes/data.route');
const recordRoutes = require('./routes/record.route');

// -- Public APIs --
app.use('/api/public/users', userPublicRoutes);
app.use('/api/public/projects', projectPublicRoutes);
app.use('/api/public/blogs', blogPublicRoutes);
app.use('/api/public/testimonials', testimonialRoutes.publicRouter);
app.use('/api/public/clients', clientRoutes.publicRouter);
app.use('/api/public/data', dataRoutes.publicRouter);

// -- Private Dashboard APIs --
app.use('/api/private/users', userPrivateRoutes);
app.use('/api/private/projects', projectPrivateRoutes);
app.use('/api/private/blogs', blogPrivateRoutes);
app.use('/api/private/testimonials', testimonialRoutes.privateRouter);
app.use('/api/private/clients', clientRoutes.privateRouter);
app.use('/api/private/data', dataRoutes.privateRouter);
app.use('/api/private/records', recordRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'API route not found' });
});

// Overall error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

module.exports = app;
