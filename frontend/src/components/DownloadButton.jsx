import { downloadDocument } from '../services/documentApi';

export default function DownloadButton({ documentId, fileName }) {
  const handleDownload = async () => {
    await downloadDocument(documentId, fileName);
  };

  return (
    <button type="button" onClick={handleDownload} style={{ padding: '0.45rem 0.75rem' }}>
      Download
    </button>
  );
}
