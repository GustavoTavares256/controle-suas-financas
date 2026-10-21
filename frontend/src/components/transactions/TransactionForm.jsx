import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import Modal from '../ui/Modal';
import FormField from '../ui/FormField';
import CurrencyInput from '../ui/CurrencyInput';
import {
  TIPO,
  TIPO_LABELS,
  FORMA_PAGAMENTO,
  FORMA_PAGAMENTO_LABELS,
  STATUS_PAGAMENTO,
  STATUS_PAGAMENTO_LABELS,
} from '../../utils/constants';
import { todayISO } from '../../utils/date';
import { validateMovimentacao } from '../../utils/validation';
import { formatCurrency } from '../../utils/format';

const initialValues = {
  descricao: '',
  valor: '',
  tipo: TIPO.DESPESA,
  categoria: '',
  data: todayISO(),
  observacao: '',
  local: '',
  formaPagamento: FORMA_PAGAMENTO.A_VISTA,
  totalParcelas: 1,
  parcelaAtual: 1,
  statusPagamento: STATUS_PAGAMENTO.PAGO,
};

export default function TransactionForm({ open, onClose, onSubmit, categorias, movimentacao, defaultTipo }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(movimentacao);
  const isDespesa = values.tipo === TIPO.DESPESA;
  const isParcelado = values.formaPagamento === FORMA_PAGAMENTO.PARCELADO;

  useEffect(() => {
    if (!open) return;
    if (movimentacao) {
      setValues({
        descricao: movimentacao.descricao || '',
        valor: movimentacao.valor ?? '',
        tipo: movimentacao.tipo || TIPO.DESPESA,
        categoria: movimentacao.categoria || '',
        data: movimentacao.data || todayISO(),
        observacao: movimentacao.observacao || '',
        local: movimentacao.local || '',
        formaPagamento: movimentacao.formaPagamento || FORMA_PAGAMENTO.A_VISTA,
        totalParcelas: movimentacao.totalParcelas ?? 1,
        parcelaAtual: movimentacao.parcelaAtual ?? 1,
        statusPagamento: movimentacao.statusPagamento || STATUS_PAGAMENTO.PAGO,
      });
    } else {
      setValues({ ...initialValues, tipo: defaultTipo || TIPO.DESPESA });
    }
    setErrors({});
  }, [open, movimentacao, defaultTipo]);

  const tipoSelecionado = values.tipo;
  const categoriasFiltradas = (categorias || []).filter((cat) => cat.tipo === tipoSelecionado);

  const valorTotalParcelado =
    isParcelado && Number(values.valor) > 0 && Number(values.totalParcelas) > 0
      ? Number(values.valor) * Number(values.totalParcelas)
      : null;

  function update(patch) {
    setValues((current) => {
      const next = { ...current, ...patch };
      if (patch.tipo && patch.tipo !== current.tipo) {
        next.categoria = '';
        if (patch.tipo === TIPO.RECEITA) {
          next.formaPagamento = FORMA_PAGAMENTO.A_VISTA;
          next.totalParcelas = 1;
          next.parcelaAtual = 1;
          next.statusPagamento = STATUS_PAGAMENTO.PAGO;
          next.local = '';
        }
      }
      if (patch.formaPagamento && patch.formaPagamento !== current.formaPagamento) {
        next.totalParcelas = 1;
        next.parcelaAtual = 1;
      }
      return next;
    });
    setErrors((current) => {
      const next = { ...current };
      Object.keys(patch).forEach((key) => delete next[key]);
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateMovimentacao(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      descricao: values.descricao.trim(),
      valor: Number(values.valor),
      tipo: values.tipo,
      categoria: values.categoria,
      data: values.data,
      observacao: (values.observacao || '').trim(),
    };

    if (values.tipo === TIPO.DESPESA) {
      payload.local = (values.local || '').trim();
      payload.formaPagamento = values.formaPagamento;
      payload.statusPagamento = values.statusPagamento;
      payload.totalParcelas =
        values.formaPagamento === FORMA_PAGAMENTO.PARCELADO ? Number(values.totalParcelas) : 1;
      payload.parcelaAtual =
        values.formaPagamento === FORMA_PAGAMENTO.PARCELADO ? Number(values.parcelaAtual) : 1;
    }

    setSaving(true);
    try {
      await onSubmit(payload);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Não foi possível salvar a movimentação.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar movimentação' : 'Nova movimentação'}
      subtitle={
        isEditing
          ? 'Atualize os dados da movimentação abaixo.'
          : `Preencha os dados da ${isDespesa ? TIPO_LABELS.DESPESA.toLowerCase() : TIPO_LABELS.RECEITA.toLowerCase()}.`
      }
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" form="transaction-form" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvando…' : isEditing ? 'Salvar alterações' : 'Cadastrar movimentação'}
          </button>
        </>
      }
    >
      <form id="transaction-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <FormField
            label="Tipo"
            htmlFor="tipo"
            required
            error={errors.tipo}
            className="full-width"
          >
            <div className="segmented" id="tipo">
              <button
                type="button"
                className={values.tipo === TIPO.RECEITA ? 'active-receita' : ''}
                onClick={() => update({ tipo: TIPO.RECEITA })}
                aria-pressed={values.tipo === TIPO.RECEITA}
              >
                <TrendingUp size={16} />
                {TIPO_LABELS.RECEITA}
              </button>
              <button
                type="button"
                className={values.tipo === TIPO.DESPESA ? 'active-despesa' : ''}
                onClick={() => update({ tipo: TIPO.DESPESA })}
                aria-pressed={values.tipo === TIPO.DESPESA}
              >
                <TrendingDown size={16} />
                {TIPO_LABELS.DESPESA}
              </button>
            </div>
          </FormField>

          <FormField
            label="Descrição"
            htmlFor="descricao"
            required
            error={errors.descricao}
            className="full-width"
          >
            <input
              id="descricao"
              className={`input ${errors.descricao ? 'error' : ''}`}
              type="text"
              maxLength={120}
              placeholder={isDespesa ? 'Ex.: Conta de luz, supermercado…' : 'Ex.: Salário, freela…'}
              value={values.descricao}
              onChange={(event) => update({ descricao: event.target.value })}
              aria-invalid={Boolean(errors.descricao)}
            />
          </FormField>

          <FormField
            label={isParcelado ? 'Valor da parcela' : 'Valor'}
            htmlFor="valor"
            required
            error={errors.valor}
            hint={
              isDespesa && isParcelado && valorTotalParcelado
                ? `Total da compra: ${formatCurrency(valorTotalParcelado)} em ${values.totalParcelas}x`
                : undefined
            }
          >
            <CurrencyInput
              id="valor"
              value={values.valor}
              onValueChange={(valor) => update({ valor })}
              className={`input ${errors.valor ? 'error' : ''}`}
              aria-invalid={Boolean(errors.valor)}
            />
          </FormField>

          <FormField label="Data" htmlFor="data" required error={errors.data}>
            <input
              id="data"
              className={`input ${errors.data ? 'error' : ''}`}
              type="date"
              value={values.data}
              onChange={(event) => update({ data: event.target.value })}
              aria-invalid={Boolean(errors.data)}
            />
          </FormField>

          <FormField
            label="Categoria"
            htmlFor="categoria"
            required
            error={errors.categoria}
            className="full-width"
          >
            <select
              id="categoria"
              className={`select ${errors.categoria ? 'error' : ''}`}
              value={values.categoria}
              onChange={(event) => update({ categoria: event.target.value })}
              aria-invalid={Boolean(errors.categoria)}
            >
              <option value="">Selecione uma categoria</option>
              {categoriasFiltradas.map((cat) => (
                <option key={cat.id ?? cat.nome} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </FormField>

          {isDespesa && (
            <>
              <FormField
                label="O que você gastou?"
                htmlFor="local"
                error={errors.local}
                hint="Ex.: Supermercado Pão de Açúcar, Uber, Farmácia…"
                className="full-width"
              >
                <div style={{ position: 'relative' }}>
                  <Receipt
                    size={15}
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    id="local"
                    className={`input ${errors.local ? 'error' : ''}`}
                    type="text"
                    maxLength={80}
                    style={{ paddingLeft: 36 }}
                    placeholder="Produto, serviço ou estabelecimento"
                    value={values.local}
                    onChange={(event) => update({ local: event.target.value })}
                    aria-invalid={Boolean(errors.local)}
                  />
                </div>
              </FormField>

              <FormField
                label="Forma de pagamento"
                htmlFor="formaPagamento"
                required
                error={errors.formaPagamento}
              >
                <select
                  id="formaPagamento"
                  className={`select ${errors.formaPagamento ? 'error' : ''}`}
                  value={values.formaPagamento}
                  onChange={(event) => update({ formaPagamento: event.target.value })}
                  aria-invalid={Boolean(errors.formaPagamento)}
                >
                  <option value={FORMA_PAGAMENTO.A_VISTA}>{FORMA_PAGAMENTO_LABELS.A_VISTA}</option>
                  <option value={FORMA_PAGAMENTO.PARCELADO}>{FORMA_PAGAMENTO_LABELS.PARCELADO}</option>
                </select>
              </FormField>

              {isParcelado && (
                <>
                  <FormField
                    label="Total de parcelas"
                    htmlFor="totalParcelas"
                    required
                    error={errors.totalParcelas}
                  >
                    <input
                      id="totalParcelas"
                      className={`input ${errors.totalParcelas ? 'error' : ''}`}
                      type="number"
                      min={2}
                      max={96}
                      step={1}
                      placeholder="Ex.: 12"
                      value={values.totalParcelas}
                      onChange={(event) =>
                        update({ totalParcelas: event.target.value === '' ? '' : Number(event.target.value) })
                      }
                      aria-invalid={Boolean(errors.totalParcelas)}
                    />
                  </FormField>

                  <FormField
                    label="Parcela atual (ex.: 1ª de 12)"
                    htmlFor="parcelaAtual"
                    required
                    error={errors.parcelaAtual}
                  >
                    <input
                      id="parcelaAtual"
                      className={`input ${errors.parcelaAtual ? 'error' : ''}`}
                      type="number"
                      min={1}
                      max={Number(values.totalParcelas) || 96}
                      step={1}
                      placeholder="Ex.: 3"
                      value={values.parcelaAtual}
                      onChange={(event) =>
                        update({ parcelaAtual: event.target.value === '' ? '' : Number(event.target.value) })
                      }
                      aria-invalid={Boolean(errors.parcelaAtual)}
                    />
                  </FormField>
                </>
              )}

              <FormField
                label="Situação do pagamento"
                htmlFor="statusPagamento"
                required
                error={errors.statusPagamento}
                hint={
                  values.statusPagamento === STATUS_PAGAMENTO.PENDENTE
                    ? 'Esta despesa será tratada como dívida pendente.'
                    : undefined
                }
              >
                <select
                  id="statusPagamento"
                  className={`select ${errors.statusPagamento ? 'error' : ''}`}
                  value={values.statusPagamento}
                  onChange={(event) => update({ statusPagamento: event.target.value })}
                  aria-invalid={Boolean(errors.statusPagamento)}
                >
                  <option value={STATUS_PAGAMENTO.PAGO}>{STATUS_PAGAMENTO_LABELS.PAGO}</option>
                  <option value={STATUS_PAGAMENTO.PENDENTE}>{STATUS_PAGAMENTO_LABELS.PENDENTE}</option>
                </select>
              </FormField>
            </>
          )}

          <FormField
            label="Observações"
            htmlFor="observacao"
            error={errors.observacao}
            hint="Opcional — até 500 caracteres."
            className="full-width"
          >
            <textarea
              id="observacao"
              className={`textarea ${errors.observacao ? 'error' : ''}`}
              maxLength={500}
              placeholder="Informações adicionais sobre a movimentação…"
              value={values.observacao}
              onChange={(event) => update({ observacao: event.target.value })}
            />
          </FormField>
        </div>

        {errors.submit && (
          <p className="field-error" style={{ marginTop: 14 }} role="alert">
            {errors.submit}
          </p>
        )}
      </form>
    </Modal>
  );
}
