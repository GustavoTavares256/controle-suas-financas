import Movimentacoes from './Movimentacoes';
import { TIPO } from '../utils/constants';

export default function Despesas() {
  return <Movimentacoes tipoFixo={TIPO.DESPESA} />;
}
