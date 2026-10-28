import type { Stats } from '../../packages/random-tables';

export const STAT_KEYS = ['strength', 'agility', 'intellect', 'will', 'health', 'defense', 'speed'] as const satisfies readonly (keyof Stats)[];

export const STAT_LABELS: Record<(typeof STAT_KEYS)[number], string> = {
  strength: 'Strength',
  agility: 'Agility',
  intellect: 'Intellect',
  will: 'Will',
  health: 'Health',
  defense: 'Defense',
  speed: 'Speed',
};

/** Characteristics formalized by CUR-015 that the L0–1 demo view does not calculate. */
export const STAT_GAPS = [
  { key: 'perception', label: 'Perception' },
  { key: 'healingRate', label: 'Healing Rate' },
  { key: 'size', label: 'Size' },
  { key: 'power', label: 'Power' },
  { key: 'damage', label: 'Damage' },
  { key: 'insanity', label: 'Insanity' },
  { key: 'corruption', label: 'Corruption' },
  { key: 'attributeModifiers', label: 'Attribute modifiers' },
] as const;

export function statValue(stats: Partial<Stats>, key: keyof Stats): number | undefined {
  const value = stats[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

export function Stats({ stats }: { stats: Partial<Stats> }) {
  return <>
    <dl className="stats" aria-label="Características do cálculo demonstrativo">{STAT_KEYS.map(key => {
      const value = statValue(stats, key);
      return <div key={key}><dt>{STAT_LABELS[key]}</dt><dd>{value === undefined ? 'indisponível' : value}</dd></div>;
    })}</dl>
    <p className="muted stats-note">Cálculo demonstrativo desta ficha. Não é pack curado nem a base Human de CUR-015.</p>
    <ul className="stats-gaps" aria-label="Características sem valor nesta ficha">{STAT_GAPS.map(gap => <li key={gap.key} data-stat-gap={gap.key}>{gap.label}: indisponível</li>)}</ul>
  </>;
}
