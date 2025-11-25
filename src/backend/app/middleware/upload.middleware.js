import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure base storage directories exist
const ensureDir = (dirPath) => {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
  } catch (err) {
    // ignore
  }
};

const baseDbDir = path.join(__dirname, '../../db');
const documentsDir = path.join(baseDbDir, 'documents');
const picturesDir = path.join(baseDbDir, 'pictures');
const avatarsDir = path.join(picturesDir, 'avatars');
const imagesDir = path.join(picturesDir, 'images');

ensureDir(documentsDir);
ensureDir(avatarsDir);
ensureDir(imagesDir);
ensureDir(path.join(documentsDir, 'downloads'));

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Decide destination based on fieldname and mimetype
    if (file.fieldname === 'file') {
      cb(null, documentsDir);
      return;
    }
    // avatar uploads
    if (file.fieldname === 'avatar') {
      cb(null, avatarsDir);
      return;
    }
    // generic images
    if (file.fieldname === 'image') {
      cb(null, imagesDir);
      return;
    }

    // fallback to documents
    cb(null, documentsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter: allow documents for 'file', images for 'avatar' and 'image'
const fileFilter = (req, file, cb) => {
  const docTypes = /\.pdf|\.docx|\.doc|\.pptx|\.ppt|\.xls|\.xlsx|\.txt$/i;
  const imgTypes = /\.jpg|\.jpeg|\.png|\.gif|\.webp|\.svg$/i;

  const ext = path.extname(file.originalname).toLowerCase();
  if (file.fieldname === 'file') {
    if (docTypes.test(ext)) return cb(null, true);
    return cb(new Error('Only document files are allowed for this field'));
  }

  // avatar or image
  if (file.fieldname === 'avatar' || file.fieldname === 'image') {
    if (imgTypes.test(ext)) return cb(null, true);
    return cb(new Error('Only image files are allowed for this field'));
  }

  // default: allow both
  if (docTypes.test(ext) || imgTypes.test(ext)) return cb(null, true);
  return cb(new Error('File type not allowed'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

export default upload;
