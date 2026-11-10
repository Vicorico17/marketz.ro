import type { MarketCategory, MarketStatus } from '@/types/market';

export function categoryLabel(category: MarketCategory) {
  const labels: Record<MarketCategory, string> = {
    politica: 'Politică',
    economie: 'Economie',
    sport: 'Sport',
    locale: 'Locale',
    cultura: 'Cultură',
    tech: 'Tehnologie',
    meteo: 'Meteo',
  };
  return labels[category];
}

export function statusLabel(status: MarketStatus) {
  const labels: Record<MarketStatus, string> = {
    draft: 'Ciornă',
    open: 'Deschisă',
    closed: 'Închisă',
    resolved: 'Rezolvată',
    voided: 'Anulată',
  };
  return labels[status];
}
