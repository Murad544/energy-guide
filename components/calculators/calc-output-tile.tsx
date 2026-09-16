type CalcOutputTileProps = { label: string; value: string };

export function CalcOutputTile({ label, value }: CalcOutputTileProps) {
  return (
    <div className="rounded-lg border border-teal/15 bg-paper-dim/70 p-5">
      <span className="text-xs uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      <strong className="mt-2 block text-2xl font-semibold tracking-tight">
        {value}
      </strong>
    </div>
  );
}
