import { PERIODOS } from '../../utils/constants';

export default function PeriodSelector({ value, onChange }) {
  return (
    <div>
      <span className="period-label">Período</span>
      <div className="period-selector" role="group" aria-label="Selecionar período">
        {PERIODOS.map((period) => (
          <button
            key={period.id}
            type="button"
            className={value === period.id ? 'active' : ''}
            onClick={() => onChange(period.id)}
            aria-pressed={value === period.id}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>
  );
}
