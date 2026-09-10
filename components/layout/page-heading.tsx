type PageHeadingProps = { eyebrow: string; title: string; lede: string };

export function PageHeading({ eyebrow, title, lede }: PageHeadingProps) {
  return (
    <header className="border-b bg-paper-dim">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-copper">
          {eyebrow}
        </p>
        <h1 className="mt-5 font-serif text-5xl tracking-[-0.03em] md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">{lede}</p>
      </div>
    </header>
  );
}
