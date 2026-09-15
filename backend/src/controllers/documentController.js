const documentService = require('../services/documentService');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Arquivo obrigatório.' });
    }

    const document = await documentService.uploadDocument(req.file, req.body.owner);
    return res.status(201).json(document);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const listDocuments = async (req, res) => {
  try {
    const documents = await documentService.listDocuments();
    return res.status(200).json(documents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const payload = await documentService.downloadDocument(req.params.id);
    return res.status(200)
      .setHeader('Content-Type', payload.mimeType || 'application/octet-stream')
      .download(payload.filePath, payload.fileName || undefined);
  } catch (error) {
    if (error.message === 'Documento não encontrado.') {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadDocument,
  listDocuments,
  downloadDocument,
};
