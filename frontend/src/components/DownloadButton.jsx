import { useState } from 'react';
import { downloadDocument } from '../services/documentApi';

export default function DownloadButton({ documentId, fileName }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setIsLoading(true);
    setError('');

    try {
      await downloadDocument(documentId, fileName);
    } catch (downloadError) {
      setError(downloadError.message || 'Não foi possível baixar o documento.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleDownload} disabled={isLoading} style={{ padding: '0.45rem 0.75rem' }}>
        {isLoading ? 'Baixando...' : 'Download'}
      </button>
      {error ? <p role="alert" style={{ color: '#b91c1c' }}>{error}</p> : null}
    </div>
  );
}
