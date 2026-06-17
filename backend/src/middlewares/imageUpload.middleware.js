import multer from "multer";
import CloudinaryStoragePkg from "multer-storage-cloudinary";
import cloudinary from '../config/cloudinary.js';

const CloudinaryStorage = CloudinaryStoragePkg.default || CloudinaryStoragePkg;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Per_ankh',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('File format not supported. Use jpeg, jpg or png.');
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
