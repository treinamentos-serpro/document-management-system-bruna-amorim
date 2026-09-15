const { randomUUID } = require('node:crypto');

const documents = [];

function detectMimeType(fileName) {
  const extension = String(fileName || '').split('.').pop()?.toLowerCase();

  const mimeTypes = {
    txt: 'text/plain',
    pdf: 'application/pdf',
    csv: 'text/csv',
    json: 'application/json',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
  };

  return mimeTypes[extension] || 'application/octet-stream';
}

const createDocument = async ({ originalName, size, fileName, filePath, owner }) => {
  const now = new Date().toISOString();
  const newDocument = {
    id: randomUUID(),
    originalName,
    size,
    uploadedAt: now,
    owner,
    fileName,
    filePath,
    mimeType: detectMimeType(originalName),
  };

  documents.push(newDocument);
  return newDocument;
};

const listDocuments = async () => documents;

const findDocumentById = async (documentId) => documents.find((document) => document.id === documentId);

module.exports = {
  createDocument,
  listDocuments,
  findDocumentById,
};
