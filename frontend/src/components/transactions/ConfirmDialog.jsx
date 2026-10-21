import { AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Excluir',
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Excluindo…' : confirmLabel}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span
          style={{
            color: 'var(--danger-600)',
            background: 'var(--danger-50)',
            borderRadius: 10,
            width: 38,
            height: 38,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={19} />
        </span>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', paddingTop: 8 }}>{message}</p>
      </div>
    </Modal>
  );
}
