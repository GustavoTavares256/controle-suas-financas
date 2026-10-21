import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Nenhum dado encontrado', description, action }) {
  return (
    <div className="empty-state">
      <div className="state-icon">
        <Inbox size={24} />
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
