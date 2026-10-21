export default function LoadingBlock({ message = 'Carregando informações…' }) {
  return (
    <div className="loading-block">
      <span className="spinner" style={{ width: 26, height: 26 }} role="status" aria-label="Carregando" />
      <span>{message}</span>
    </div>
  );
}
