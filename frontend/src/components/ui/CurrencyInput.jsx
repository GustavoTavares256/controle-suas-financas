import { useRef } from 'react';
import { formatNumberAsCurrencyInput, parseCurrencyToNumber } from '../../utils/format';

export default function CurrencyInput({ id, value, onValueChange, placeholder = '0,00', ...rest }) {
  const inputRef = useRef(null);

  function handleChange(event) {
    const raw = event.target.value;
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      onValueChange('');
      return;
    }
    const number = Number(digits) / 100;
    onValueChange(number);
  }

  function handleBlur() {
    if (value !== '' && value !== null && value !== undefined) {
      onValueChange(parseCurrencyToNumber(value));
    }
  }

  const display = value === '' || value === null || value === undefined ? '' : formatNumberAsCurrencyInput(value);

  return (
    <input
      ref={inputRef}
      id={id}
      className="input"
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      {...rest}
    />
  );
}
