import React, { useContext, useState } from 'react';
import { ExchangeRateContext } from '../lib/ExchangeRateContext';
import { SettingsContext } from '../lib/SettingsContext';

interface MoneyProps {
  amount: number;
  className?: string;
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

function formatCurrency(amount: number, code: string) {
  const symbol = currencySymbols[code] || code;
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const Money: React.FC<MoneyProps> = ({ amount, className }) => {
  const { rate } = useContext(ExchangeRateContext);
  const { settings } = useContext(SettingsContext);
  const [hovered, setHovered] = useState(false);

  // Determine what to show by default and on hover
  let display = formatCurrency(amount, settings.preferredCurrency);
  let hoverDisplay = display;

  // Only convert if enabled and not the same as preferred
  if (settings.conversionEnabled && settings.conversionCurrency !== settings.preferredCurrency) {
    if (settings.preferredCurrency === 'USD' && settings.conversionCurrency === 'INR' && rate) {
      hoverDisplay = formatCurrency(amount * rate, 'INR');
    } else if (settings.preferredCurrency === 'INR' && settings.conversionCurrency === 'USD' && rate) {
      hoverDisplay = formatCurrency(amount / rate, 'USD');
    } else {
      // For other currencies, just show the amount with the symbol (no conversion logic yet)
      hoverDisplay = formatCurrency(amount, settings.conversionCurrency);
    }
  }

  return (
    <span
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: settings.conversionEnabled ? 'pointer' : undefined, transition: 'color 0.2s' }}
      title={settings.conversionEnabled && settings.conversionCurrency !== settings.preferredCurrency ? (hovered ? `Showing in ${settings.conversionCurrency}` : `Showing in ${settings.preferredCurrency}`) : undefined}
    >
      {settings.conversionEnabled && hovered && settings.conversionCurrency !== settings.preferredCurrency ? hoverDisplay : display}
    </span>
  );
};

export default Money; 