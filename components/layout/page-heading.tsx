type PageHeadingProps = { eyebrow: string; title: string; lede: string };
export function PageHeading({ eyebrow, title, lede }: PageHeadingProps) {
  return (
    <header className="relative overflow-hidden border-b bg-paper-dim/60">
      <div className="animate-enter mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
        <p className="eyebrow">
          <span className="h-2 w-2 rounded-full bg-teal" />
          {eyebrow}
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft md:text-lg">
          {lede}
        </p>
      </div>
    </header>
  );
}
