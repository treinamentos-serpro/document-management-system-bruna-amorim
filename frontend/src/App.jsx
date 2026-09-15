import { useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';
import { fetchDocuments } from './services/documentApi';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDocuments = async () => {
    setIsLoading(true);
    setError('');

    try {
      const payload = await fetchDocuments();
      setDocuments(payload);
    } catch (loadError) {
      setError(loadError.message || 'Não foi possível carregar os documentos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', display: 'grid', gap: '1.5rem' }}>
      <h1>Document Management System</h1>

      <UploadComponent onUploadSuccess={loadDocuments} />
      {isLoading ? <p>Carregando documentos...</p> : null}
      {error ? (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={loadDocuments}>Tentar novamente</button>
        </div>
      ) : null}
      {!isLoading && !error ? <DocumentList documents={documents} /> : null}
    </main>
  );
}
