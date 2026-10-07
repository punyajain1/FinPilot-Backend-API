import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: 'USD' | 'INR' = 'USD', compact = false) {
  if (value === undefined || value === null) return '—';
  
  const absVal = Math.abs(value);
  let maxFrac = compact ? 1 : 2;
  if (absVal > 0 && absVal < 1) {
    maxFrac = Math.max(6, Math.ceil(Math.abs(Math.log10(absVal))) + 2);
  }
  
  const minFrac = compact ? 0 : 2;

  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: minFrac,
    maximumFractionDigits: maxFrac,
    ...(compact ? { notation: "compact", compactDisplay: "short" } : {}),
  }).format(value);
}

export function formatNumber(value: number, minFrac = 2, maxFrac = 2, compact = false) {
  if (value === undefined || value === null) return '—';
  
  const absVal = Math.abs(value);
  let resolvedMaxFrac = maxFrac;
  // If the number is non-zero but very small, dynamically expand maxFrac
  if (absVal > 0 && absVal < 1) {
    resolvedMaxFrac = Math.max(6, Math.ceil(Math.abs(Math.log10(absVal))) + 2, maxFrac);
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: compact ? 0 : minFrac,
    maximumFractionDigits: compact ? 1 : resolvedMaxFrac,
    ...(compact ? { notation: "compact", compactDisplay: "short" } : {}),
  }).format(value);
}

export function formatPercent(value: number, signDisplay: 'auto' | 'always' = 'auto') {
  if (value === undefined || value === null) return '—';
  // Assuming value is already a percentage (e.g. 5.5 for 5.5%)
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay,
  }).format(value / 100);
}
