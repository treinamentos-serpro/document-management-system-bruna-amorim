import { useState } from 'react';
import { uploadDocument } from '../services/documentApi';

export default function UploadComponent({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError('Selecione um arquivo antes de enviar.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = await uploadDocument(file, owner.trim());
      setFile(null);
      setOwner('');
      if (onUploadSuccess) {
        onUploadSuccess(payload);
      }
    } catch (uploadError) {
      setError(uploadError.message || 'Erro ao enviar o arquivo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem', maxWidth: '420px' }}>
      <h2>Enviar documento</h2>

      <label>
        <div style={{ marginBottom: '0.35rem' }}>Arquivo</div>
        <input
          type="file"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
      </label>

      <label>
        <div style={{ marginBottom: '0.35rem' }}>Dono</div>
        <input
          type="text"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          placeholder="bruna"
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </label>

      <button type="submit" disabled={isLoading} style={{ padding: '0.7rem 1rem' }}>
        {isLoading ? 'Enviando...' : 'Enviar'}
      </button>

      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
    </form>
  );
}
