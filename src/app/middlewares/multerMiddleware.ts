import multer from "multer";
import fs from "fs";
import path from "path";

// Use disk storage in a dedicated uploads directory served statically by Express
const UPLOAD_ROOT = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
const CHAT_DIR = path.join(UPLOAD_ROOT, "chat");
const SITE_DIR = path.join(UPLOAD_ROOT, "site");
fs.mkdirSync(CHAT_DIR, { recursive: true });
fs.mkdirSync(SITE_DIR, { recursive: true });

const chatStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, CHAT_DIR);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || "");
    cb(null, `${unique}${ext}`);
  },
});

const siteStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, SITE_DIR);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || "");
    cb(null, `logo-${unique}${ext}`);
  },
});

export const upload = multer({
  storage: chatStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // up to 20MB; adjust as needed
});

export const siteUpload = multer({
  storage: siteStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // up to 5MB for site assets
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});
