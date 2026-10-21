export function formatDate(isoDate) {
  if (!isoDate) return '—';
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('pt-BR');
}

export function formatDateLong(isoDate) {
  if (!isoDate) return '—';
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function toISODate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function getPeriodRange(periodId) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  switch (periodId) {
    case 'mes_atual': {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);
      return { dataInicio: toISODate(start), dataFim: toISODate(end) };
    }
    case 'mes_passado': {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      return { dataInicio: toISODate(start), dataFim: toISODate(end) };
    }
    case 'ultimos_30_dias': {
      const start = new Date(year, month, now.getDate() - 29);
      return { dataInicio: toISODate(start), dataFim: toISODate(now) };
    }
    case 'ultimos_90_dias': {
      const start = new Date(year, month, now.getDate() - 89);
      return { dataInicio: toISODate(start), dataFim: toISODate(now) };
    }
    case 'ano_atual': {
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);
      return { dataInicio: toISODate(start), dataFim: toISODate(end) };
    }
    case 'todos':
    default:
      return { dataInicio: '', dataFim: '' };
  }
}

export function getMonthLabel(isoDate) {
  const date = new Date(`${isoDate}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
}

export function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
}
