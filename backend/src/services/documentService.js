const documentRepository = require('../repositories/documentRepository');

const toPublicDocument = (document) => ({
  id: document.id,
  originalName: document.originalName,
  size: document.size,
  uploadedAt: document.uploadedAt,
  owner: document.owner,
});

const uploadDocument = async (file, owner) => {
  if (!file) {
    throw new Error('Arquivo obrigatório.');
  }

  const savedDocument = await documentRepository.createDocument({
    originalName: file.originalname,
    size: file.size,
    fileName: file.filename,
    filePath: file.path,
    owner: owner || 'anonymous',
  });

  return toPublicDocument(savedDocument);
};

const listDocuments = async () => {
  const documents = await documentRepository.listDocuments();

  return documents.map(toPublicDocument);
};

const downloadDocument = async (documentId) => {
  const document = await documentRepository.findDocumentById(documentId);

  if (!document) {
    throw new Error('Documento não encontrado.');
  }

  return {
    filePath: document.filePath,
    fileName: document.fileName,
    mimeType: document.mimeType || 'application/octet-stream',
  };
};

module.exports = {
  uploadDocument,
  listDocuments,
  downloadDocument,
};
