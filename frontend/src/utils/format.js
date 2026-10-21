const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return 'R$ 0,00';
  return brlFormatter.format(number);
}

export function formatCurrencyCompact(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return 'R$ 0,00';
  const abs = Math.abs(number);
  const sign = number < 0 ? '-' : '';
  if (abs >= 1000000) {
    return `${sign}R$ ${(abs / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`;
  }
  if (abs >= 1000) {
    return `${sign}R$ ${(abs / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil`;
  }
  return brlFormatter.format(number);
}

export function formatPercent(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return '0%';
  return `${number.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
}

export function parseCurrencyToNumber(input) {
  if (typeof input === 'number') return input;
  if (!input) return 0;
  const cleaned = String(input)
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const number = Number(cleaned);
  return Number.isNaN(number) ? 0 : number;
}

export function formatNumberAsCurrencyInput(value) {
  if (value === '' || value === null || value === undefined) return '';
  const number = typeof value === 'number' ? value : parseCurrencyToNumber(value);
  if (Number.isNaN(number)) return '';
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
