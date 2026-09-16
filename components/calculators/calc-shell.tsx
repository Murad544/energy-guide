type CalcShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function CalcShell({ title, description, children }: CalcShellProps) {
  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <header className="border-b p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-3 max-w-2xl leading-7 text-ink-soft">{description}</p>
      </header>
      <div className="p-6 md:p-8">{children}</div>
    </section>
  );
}
