const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const DocumentsController = require('../controllers/DocumentsController');
const auth = require('../middleware/auth');
const ClientError = require('../exceptions/ClientError');
const { documentMimeTypes } = require('../validators/documents');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (documentMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ClientError('File is required and must be a PDF document'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

router.get('/', DocumentsController.getAllDocuments);
router.get('/:id', DocumentsController.getDocumentById);

router.post('/', auth, upload.single('document'), DocumentsController.uploadDocument);
router.delete('/:id', auth, DocumentsController.deleteDocument);

module.exports = router;
