const multer = require('multer');
const path = require('path');
const fs = require('fs');

const folders = ['projects', 'blogs', 'testimonials', 'clients'];
folders.forEach(folder => {
    const dir = path.join(__dirname, '..', 'uploads', folder);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure Multer Storage
// NOTE: Replace this diskStorage configuration with multer-s3 or multer-storage-cloudinary to save images to cloud
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'projects';
        if (req.originalUrl.includes('blog')) folder = 'blogs';
        if (req.originalUrl.includes('testimonial')) folder = 'testimonials';
        if (req.originalUrl.includes('client')) folder = 'clients';
        
        cb(null, path.join(__dirname, '..', 'uploads', folder));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});

module.exports = upload;
