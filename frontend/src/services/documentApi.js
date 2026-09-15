async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload?.message || 'Erro ao processar a requisição.';
    throw new Error(message);
  }

  return payload;
}

export async function uploadDocument(file, owner) {
  const formData = new FormData();
  formData.append('file', file);

  if (owner) {
    formData.append('owner', owner);
  }

  return request('/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function fetchDocuments() {
  return request('/documents');
}

export async function downloadDocument(documentId, fileName) {
  const response = await fetch(`/api/documents/${documentId}/download`);

  if (!response.ok) {
    throw new Error('Não foi possível baixar o documento.');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'documento';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
