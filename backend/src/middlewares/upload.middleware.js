import multer from "multer";
import CloudinaryStoragePkg from "multer-storage-cloudinary";
import cloudinary from '../config/cloudinary.js';

const CloudinaryStorageClass = CloudinaryStoragePkg.CloudinaryStorage || CloudinaryStoragePkg.default || CloudinaryStoragePkg;

const storage = new CloudinaryStorageClass({
  cloudinary: { v2: cloudinary },
  params: {
    folder: 'Per_ankh',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'txt', 'zip'],
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'text/plain', 
    'application/zip'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('File format not supported.');
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
export default upload;