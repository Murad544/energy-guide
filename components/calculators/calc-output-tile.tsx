type CalcOutputTileProps = { label: string; value: string };

export function CalcOutputTile({ label, value }: CalcOutputTileProps) {
  return (
    <div className="border-l-2 border-amber bg-paper-dim p-4">
      <span className="text-xs uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      <strong className="mt-2 block font-serif text-2xl">{value}</strong>
    </div>
  );
}
