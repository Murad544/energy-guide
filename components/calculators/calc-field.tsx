type CalcFieldProps = {
  label: string;
  suffix?: string;
  children: React.ReactNode;
};

export function CalcField({ label, suffix, children }: CalcFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 flex justify-between text-sm font-semibold">
        <span>{label}</span>
        {suffix ? (
          <span className="font-normal text-ink-soft">{suffix}</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}
