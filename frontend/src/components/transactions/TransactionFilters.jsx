import { Search, X } from 'lucide-react';
import { PERIODOS, TIPO } from '../../utils/constants';

export default function TransactionFilters({
  filters,
  onChange,
  categorias,
  hideTipo = false,
}) {
  function update(patch) {
    onChange({ ...filters, ...patch });
  }

  const hasActiveFilters =
    filters.busca || filters.categoria || filters.tipo || filters.periodo !== 'todos';

  return (
    <div className="filters-bar">
      <div className="search-wrap">
        <Search size={16} />
        <input
          type="search"
          className="input"
          placeholder="Buscar por descrição…"
          value={filters.busca}
          onChange={(event) => update({ busca: event.target.value })}
          aria-label="Buscar por descrição"
        />
      </div>

      <select
        className="select"
        value={filters.periodo}
        onChange={(event) => update({ periodo: event.target.value })}
        aria-label="Filtrar por período"
      >
        {PERIODOS.map((periodo) => (
          <option key={periodo.id} value={periodo.id}>
            {periodo.label}
          </option>
        ))}
      </select>

      <select
        className="select"
        value={filters.categoria}
        onChange={(event) => update({ categoria: event.target.value })}
        aria-label="Filtrar por categoria"
      >
        <option value="">Todas as categorias</option>
        {categorias.map((cat) => (
          <option key={cat.id ?? cat.nome} value={cat.nome}>
            {cat.nome}
          </option>
        ))}
      </select>

      {!hideTipo && (
        <select
          className="select"
          value={filters.tipo}
          onChange={(event) => update({ tipo: event.target.value })}
          aria-label="Filtrar por tipo"
        >
          <option value="">Entradas e despesas</option>
          <option value={TIPO.RECEITA}>Somente entradas</option>
          <option value={TIPO.DESPESA}>Somente despesas</option>
        </select>
      )}

      <select
        className="select"
        value={filters.ordenacao}
        onChange={(event) => update({ ordenacao: event.target.value })}
        aria-label="Ordenar por"
      >
        <option value="-data">Mais recentes</option>
        <option value="data">Mais antigas</option>
        <option value="-valor">Maior valor</option>
        <option value="valor">Menor valor</option>
      </select>

      {hasActiveFilters && (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() =>
            onChange({ busca: '', periodo: 'todos', categoria: '', tipo: '', ordenacao: '-data' })
          }
        >
          <X size={14} />
          Limpar
        </button>
      )}
    </div>
  );
}
