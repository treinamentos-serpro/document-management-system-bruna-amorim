const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs/promises');
const path = require('node:path');
const app = require('../src/app');

const storageDirectory = path.resolve(__dirname, '../storage');

async function withServer(testFn) {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    await testFn(port);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}

// Teste de fumaça do seed: garante que o app Express foi exportado.
test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

test('POST /upload salva um documento e retorna metadados', async () => {
  await withServer(async (port) => {
    const formData = new FormData();
    formData.append('file', new Blob(['conteudo de teste'], { type: 'text/plain' }), 'arquivo.txt');
    formData.append('owner', 'bruna');

    const response = await fetch(`http://127.0.0.1:${port}/upload`, {
      method: 'POST',
      body: formData,
    });

    assert.strictEqual(response.status, 201, 'deve criar o documento com sucesso');

    const payload = await response.json();
    assert.strictEqual(payload.originalName, 'arquivo.txt');
    assert.strictEqual(payload.owner, 'bruna');
    assert.ok(payload.id, 'deve incluir um identificador');
    assert.ok(payload.uploadedAt, 'deve incluir data de upload');
  });
});

test('GET /documents lista os documentos salvos', async () => {
  await withServer(async (port) => {
    const uploadForm = new FormData();
    uploadForm.append('file', new Blob(['lista'], { type: 'text/plain' }), 'lista.txt');
    uploadForm.append('owner', 'bruna');

    await fetch(`http://127.0.0.1:${port}/upload`, {
      method: 'POST',
      body: uploadForm,
    });

    const response = await fetch(`http://127.0.0.1:${port}/documents`);
    assert.strictEqual(response.status, 200, 'deve listar documentos');

    const payload = await response.json();
    assert.ok(Array.isArray(payload), 'deve retornar uma lista');
    assert.ok(payload.some((item) => item.originalName === 'lista.txt'));
  });
});

test('GET /documents/:id/download retorna o arquivo', async () => {
  await withServer(async (port) => {
    const uploadForm = new FormData();
    uploadForm.append('file', new Blob(['arquivo para download'], { type: 'text/plain' }), 'download.txt');
    uploadForm.append('owner', 'bruna');

    const uploadResponse = await fetch(`http://127.0.0.1:${port}/upload`, {
      method: 'POST',
      body: uploadForm,
    });

    const uploaded = await uploadResponse.json();

    const response = await fetch(`http://127.0.0.1:${port}/documents/${uploaded.id}/download`);
    assert.strictEqual(response.status, 200, 'deve disponibilizar o download');
    assert.strictEqual(await response.text(), 'arquivo para download');
    assert.strictEqual(response.headers.get('content-type'), 'text/plain');
  });
});

test('POST /upload rejeita requisição sem arquivo', async () => {
  await withServer(async (port) => {
    const response = await fetch(`http://127.0.0.1:${port}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner: 'bruna' }),
    });

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(await response.json(), { message: 'Arquivo obrigatório.' });
  });
});

test('POST /upload rejeita tipo de arquivo não permitido', async () => {
  await withServer(async (port) => {
    const formData = new FormData();
    formData.append('file', new Blob(['executavel'], { type: 'application/x-shockwave-flash' }), 'arquivo.swf');

    const response = await fetch(`http://127.0.0.1:${port}/upload`, {
      method: 'POST',
      body: formData,
    });

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(await response.json(), { message: 'Tipo de arquivo não permitido.' });
  });
});

test('POST /upload não usa o nome original no caminho físico', async () => {
  await withServer(async (port) => {
    const filesBefore = new Set(await fs.readdir(storageDirectory));
    const formData = new FormData();
    formData.append('file', new Blob(['seguro'], { type: 'text/plain' }), '../../fora-do-storage.txt');

    const response = await fetch(`http://127.0.0.1:${port}/upload`, {
      method: 'POST',
      body: formData,
    });

    assert.strictEqual(response.status, 201);

    const filesAfter = await fs.readdir(storageDirectory);
    const createdFiles = filesAfter.filter((fileName) => !filesBefore.has(fileName));
    assert.strictEqual(createdFiles.length, 1);
    assert.match(createdFiles[0], /^[0-9a-f-]{36}\.txt$/);
    assert.strictEqual(await fs.access(path.resolve(storageDirectory, '../../fora-do-storage.txt')).then(() => true).catch(() => false), false);
  });
});
