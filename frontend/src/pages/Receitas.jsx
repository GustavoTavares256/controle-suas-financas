import Movimentacoes from './Movimentacoes';
import { TIPO } from '../utils/constants';

export default function Receitas() {
  return <Movimentacoes tipoFixo={TIPO.RECEITA} />;
}
