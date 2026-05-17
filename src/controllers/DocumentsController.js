const DocumentsService = require('../services/DocumentsService');
const ClientError = require('../exceptions/ClientError');

class DocumentsController {
  async uploadDocument(req, res, next) {
    try {
      if (!req.file) {
        throw new ClientError('No file uploaded. Use field name "document"');
      }
      const { originalname, filename, path: filePath, size, mimetype } = req.file;
      const document = await DocumentsService.saveDocument({
        user_id: req.user.id,
        filename,
        originalName: originalname,
        filePath,
        fileSize: size,
        mimeType: mimetype,
      });
      return res.status(201).json({
        status: 'success',
        message: 'Document uploaded successfully',
        data: { id: document.id, documentId: document.id },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllDocuments(req, res, next) {
    try {
      const documents = await DocumentsService.getAllDocuments();
      return res.status(200).json({
        status: 'success',
        data: { documents },
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocumentById(req, res, next) {
    try {
      const document = await DocumentsService.getDocumentById(req.params.id);
      return res.status(200).json({
        status: 'success',
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req, res, next) {
    try {
      await DocumentsService.deleteDocument(req.params.id, req.user.id);
      return res.status(200).json({
        status: 'success',
        message: 'Document deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DocumentsController();
