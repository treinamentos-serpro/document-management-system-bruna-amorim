const documentRepository = require('../repositories/documentRepository');

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

  return {
    id: savedDocument.id,
    originalName: savedDocument.originalName,
    size: savedDocument.size,
    uploadedAt: savedDocument.uploadedAt,
    owner: savedDocument.owner,
  };
};

const listDocuments = async () => {
  const documents = await documentRepository.listDocuments();

  return documents.map((document) => ({
    id: document.id,
    originalName: document.originalName,
    size: document.size,
    uploadedAt: document.uploadedAt,
    owner: document.owner,
  }));
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
