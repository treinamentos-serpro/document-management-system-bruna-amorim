const express = require('express');
const multer = require('multer');
const path = require('path');
const { randomUUID } = require('node:crypto');

const documentController = require('../controllers/documentController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../../storage'));
  },
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${randomUUID()}-${sanitizedName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const router = express.Router();

router.post('/upload', upload.single('file'), documentController.uploadDocument);
router.get('/documents', documentController.listDocuments);
router.get('/documents/:id/download', documentController.downloadDocument);

module.exports = router;
