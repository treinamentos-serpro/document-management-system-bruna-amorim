const path = require('node:path');
const documentRepository = require('../repositories/documentRepository');

const storageDirectory = path.resolve(__dirname, '../../storage');
const defaultOwner = 'anonymous';

function toDocumentResponse(document) {
  return {
    id: document.id,
    originalName: document.originalName,
    size: document.size,
    uploadedAt: document.uploadedAt,
    owner: document.owner,
  };
}

function normalizeOwner(owner) {
  const normalizedOwner = typeof owner === 'string' ? owner.trim() : '';

  if (normalizedOwner.length > 100) {
    const error = new Error('O dono deve ter no máximo 100 caracteres.');
    error.statusCode = 400;
    throw error;
  }

  return normalizedOwner || defaultOwner;
}

function resolveStoredFile(filePath) {
  const resolvedPath = path.resolve(filePath);
  const relativePath = path.relative(storageDirectory, resolvedPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    const error = new Error('Caminho de arquivo inválido.');
    error.statusCode = 500;
    throw error;
  }

  return resolvedPath;
}

const uploadDocument = async (file, owner) => {
  if (!file) {
    throw new Error('Arquivo obrigatório.');
  }

  const savedDocument = await documentRepository.createDocument({
    originalName: file.originalname,
    size: file.size,
    fileName: file.filename,
    filePath: file.path,
    owner: normalizeOwner(owner),
  });

  return toDocumentResponse(savedDocument);
};

const listDocuments = async () => {
  const documents = await documentRepository.listDocuments();

  return documents.map(toDocumentResponse);
};

const downloadDocument = async (documentId) => {
  const document = await documentRepository.findDocumentById(documentId);

  if (!document) {
    throw new Error('Documento não encontrado.');
  }

  return {
    filePath: resolveStoredFile(document.filePath),
    fileName: document.fileName,
    mimeType: document.mimeType || 'application/octet-stream',
  };
};

module.exports = {
  uploadDocument,
  listDocuments,
  downloadDocument,
};
