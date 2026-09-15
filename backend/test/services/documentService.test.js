const { beforeEach, test } = require('node:test');
const assert = require('node:assert');

const servicePath = require.resolve('../../src/services/documentService');
const repositoryPath = require.resolve('../../src/repositories/documentRepository');

let documentService;

const loadService = () => {
  delete require.cache[servicePath];
  delete require.cache[repositoryPath];
  documentService = require('../../src/services/documentService');
};

beforeEach(() => {
  loadService();
});

test('uploadDocument retorna apenas metadados públicos e owner padrão', async () => {
  const document = await documentService.uploadDocument({
    originalname: 'arquivo.txt',
    size: 123,
    filename: 'stored-file.txt',
    path: '/tmp/stored-file.txt',
  });

  assert.deepStrictEqual(Object.keys(document).sort(), [
    'id',
    'originalName',
    'owner',
    'size',
    'uploadedAt',
  ]);
  assert.strictEqual(document.originalName, 'arquivo.txt');
  assert.strictEqual(document.size, 123);
  assert.strictEqual(document.owner, 'anonymous');
  assert.ok(document.id);
  assert.ok(document.uploadedAt);
});

test('listDocuments reutiliza o mesmo contrato público do upload', async () => {
  await documentService.uploadDocument({
    originalname: 'relatorio.pdf',
    size: 456,
    filename: 'stored-report.pdf',
    path: '/tmp/stored-report.pdf',
  }, 'bruna');

  const documents = await documentService.listDocuments();

  assert.strictEqual(documents.length, 1);
  assert.deepStrictEqual(Object.keys(documents[0]).sort(), [
    'id',
    'originalName',
    'owner',
    'size',
    'uploadedAt',
  ]);
  assert.strictEqual(documents[0].originalName, 'relatorio.pdf');
  assert.strictEqual(documents[0].owner, 'bruna');
});

test('downloadDocument mantém os dados necessários para baixar o arquivo', async () => {
  const uploadedDocument = await documentService.uploadDocument({
    originalname: 'dados.json',
    size: 789,
    filename: 'stored-data.json',
    path: '/tmp/stored-data.json',
  }, 'api');

  const payload = await documentService.downloadDocument(uploadedDocument.id);

  assert.deepStrictEqual(payload, {
    filePath: '/tmp/stored-data.json',
    fileName: 'stored-data.json',
    mimeType: 'application/json',
  });
});

test('uploadDocument falha sem arquivo', async () => {
  await assert.rejects(
    documentService.uploadDocument(),
    {
      message: 'Arquivo obrigatório.',
    },
  );
});
