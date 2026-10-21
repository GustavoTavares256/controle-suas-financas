import { TIPO, TIPO_LABELS } from './constants';
import { isValidISODate } from './date';

export function validateMovimentacao(values) {
  const errors = {};
  const isDespesa = values.tipo === TIPO.DESPESA;

  if (!values.descricao || !values.descricao.trim()) {
    errors.descricao = 'Informe a descrição da movimentação.';
  } else if (values.descricao.trim().length < 3) {
    errors.descricao = 'A descrição deve ter pelo menos 3 caracteres.';
  } else if (values.descricao.trim().length > 120) {
    errors.descricao = 'A descrição deve ter no máximo 120 caracteres.';
  }

  const valor = Number(values.valor);
  if (values.valor === '' || values.valor === null || values.valor === undefined) {
    errors.valor = 'Informe o valor da movimentação.';
  } else if (Number.isNaN(valor)) {
    errors.valor = 'Informe um valor numérico válido.';
  } else if (valor <= 0) {
    errors.valor = 'O valor deve ser maior que zero.';
  }

  if (!values.tipo || ![TIPO.RECEITA, TIPO.DESPESA].includes(values.tipo)) {
    errors.tipo = `Selecione o tipo da movimentação (${TIPO_LABELS.RECEITA} ou ${TIPO_LABELS.DESPESA}).`;
  }

  if (!values.categoria || !String(values.categoria).trim()) {
    errors.categoria = 'Selecione uma categoria.';
  }

  if (!values.data) {
    errors.data = 'Informe a data da movimentação.';
  } else if (!isValidISODate(values.data)) {
    errors.data = 'Informe uma data válida.';
  }

  if (values.observacao && values.observacao.length > 500) {
    errors.observacao = 'A observação deve ter no máximo 500 caracteres.';
  }

  if (values.local && values.local.length > 80) {
    errors.local = 'O local deve ter no máximo 80 caracteres.';
  }

  if (isDespesa) {
    if (!values.formaPagamento) {
      errors.formaPagamento = 'Selecione a forma de pagamento.';
    }

    if (values.formaPagamento === 'PARCELADO') {
      const total = Number(values.totalParcelas);
      const atual = Number(values.parcelaAtual);

      if (!values.totalParcelas || Number.isNaN(total)) {
        errors.totalParcelas = 'Informe o total de parcelas.';
      } else if (!Number.isInteger(total) || total < 2 || total > 96) {
        errors.totalParcelas = 'O total de parcelas deve ser um inteiro entre 2 e 96.';
      }

      if (!values.parcelaAtual || Number.isNaN(atual)) {
        errors.parcelaAtual = 'Informe a parcela atual.';
      } else if (!Number.isInteger(atual) || atual < 1) {
        errors.parcelaAtual = 'A parcela atual deve ser maior ou igual a 1.';
      } else if (!errors.totalParcelas && atual > total) {
        errors.parcelaAtual = 'A parcela atual não pode superar o total de parcelas.';
      }
    }

    if (!values.statusPagamento) {
      errors.statusPagamento = 'Informe a situação do pagamento.';
    }
  }

  return errors;
}
