type CalcShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function CalcShell({ title, description, children }: CalcShellProps) {
  return (
    <section className="border bg-paper">
      <header className="border-b p-6">
        <h2 className="font-serif text-3xl">{title}</h2>
        <p className="mt-3 max-w-2xl leading-7 text-ink-soft">{description}</p>
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}
