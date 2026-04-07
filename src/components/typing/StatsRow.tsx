interface StatsRowProps {
  wpm: number
  accuracy: number
  time: number
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2 text-center sm:p-2.5">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-base font-semibold sm:text-lg">{value}</p>
    </div>
  )
}

export function StatsRow({ wpm, accuracy, time }: StatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
      <StatItem label="WPM" value={wpm.toFixed(1)} />
      <StatItem label="Accuracy" value={`${accuracy.toFixed(1)}%`} />
      <StatItem label="Time" value={`${time.toFixed(1)}s`} />
    </div>
  )
}
