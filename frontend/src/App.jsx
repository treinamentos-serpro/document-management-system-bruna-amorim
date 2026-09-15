import { useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';
import { fetchDocuments } from './services/documentApi';

export default function App() {
  const [documents, setDocuments] = useState([]);

  const loadDocuments = async () => {
    try {
      const payload = await fetchDocuments();
      setDocuments(payload);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', display: 'grid', gap: '1.5rem' }}>
      <h1>Document Management System</h1>

      <UploadComponent onUploadSuccess={loadDocuments} />
      <DocumentList documents={documents} />
    </main>
  );
}
