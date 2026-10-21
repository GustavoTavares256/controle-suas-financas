import { TrendingUp, TrendingDown } from 'lucide-react';
import { TIPO, TIPO_LABELS } from '../../utils/constants';

export default function TypeBadge({ tipo }) {
  const isEntrada = tipo === TIPO.RECEITA;
  return (
    <span className={`badge ${isEntrada ? 'badge-receita' : 'badge-despesa'}`}>
      {isEntrada ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {isEntrada ? TIPO_LABELS.RECEITA : TIPO_LABELS.DESPESA}
    </span>
  );
}
