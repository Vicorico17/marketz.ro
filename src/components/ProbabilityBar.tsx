import { toPercent } from '@/lib/marketMath';
import type { MarketOutcome } from '@/types/market';

interface ProbabilityBarProps {
  outcomes: MarketOutcome[];
  probabilities: Record<string, number>;
  compact?: boolean;
}

export function ProbabilityBar({ outcomes, probabilities, compact }: ProbabilityBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex h-3 overflow-hidden rounded-full bg-zinc-800">
        {outcomes.map((outcome) => (
          <div
            key={outcome.id}
            className="h-full"
            style={{
              width: `${Math.max(toPercent(probabilities[outcome.id] || 0), 2)}%`,
              backgroundColor: outcome.color,
            }}
          />
        ))}
      </div>
      <div className={`grid gap-2 ${compact ? 'grid-cols-2 text-xs' : 'grid-cols-1 sm:grid-cols-2 text-sm'}`}>
        {outcomes.map((outcome) => (
          <div key={outcome.id} className="flex min-w-0 items-center justify-between gap-2 text-zinc-300">
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: outcome.color }} />
              <span className="truncate">{outcome.label}</span>
            </span>
            <span className="shrink-0 font-semibold text-white">{toPercent(probabilities[outcome.id] || 0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
