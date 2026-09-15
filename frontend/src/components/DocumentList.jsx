import DownloadButton from './DownloadButton';

export default function DocumentList({ documents }) {
  if (!documents || documents.length === 0) {
    return <p>Nenhum documento encontrado.</p>;
  }

  return (
    <section style={{ display: 'grid', gap: '0.75rem', maxWidth: '720px' }}>
      <h2>Documentos</h2>

      {documents.map((document) => (
        <article
          key={document.id}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            padding: '1rem',
            display: 'grid',
            gap: '0.4rem',
          }}
        >
          <strong>{document.originalName}</strong>
          <div>Tamanho: {document.size} bytes</div>
          <div>Enviado em: {new Date(document.uploadedAt).toLocaleString('pt-BR')}</div>
          <div>Dono: {document.owner}</div>
          <DownloadButton documentId={document.id} fileName={document.originalName} />
        </article>
      ))}
    </section>
  );
}
