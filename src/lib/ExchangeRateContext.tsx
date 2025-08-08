import React, { createContext, useEffect, useState, ReactNode } from 'react';

interface ExchangeRateContextType {
  rate: number | null;
  loading: boolean;
  error: string | null;
}

export const ExchangeRateContext = createContext<ExchangeRateContextType>({
  rate: null,
  loading: true,
  error: null,
});

export const ExchangeRateProvider = ({ children }: { children: ReactNode }) => {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Example API: https://api.exchangerate-api.com/v4/latest/USD
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.INR) {
          setRate(data.rates.INR);
        } else {
          setError('Could not fetch INR rate');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch exchange rate');
        setLoading(false);
      });
  }, []);

  return (
    <ExchangeRateContext.Provider value={{ rate, loading, error }}>
      {children}
    </ExchangeRateContext.Provider>
  );
}; 