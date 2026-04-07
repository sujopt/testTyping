interface StatsRowProps {
  wpm: number
  accuracy: number
  time: number
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3 text-center">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground sm:text-xs">{label}</p>
      <p className="mt-1 text-lg font-semibold sm:text-xl">{value}</p>
    </div>
  )
}

export function StatsRow({ wpm, accuracy, time }: StatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <StatItem label="WPM" value={wpm.toFixed(1)} />
      <StatItem label="Accuracy" value={`${accuracy.toFixed(1)}%`} />
      <StatItem label="Time" value={`${time.toFixed(1)}s`} />
    </div>
  )
}
