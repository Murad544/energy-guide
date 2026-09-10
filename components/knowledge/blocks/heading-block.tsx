export function HeadingBlock({ level, text }: { level: 3 | 4; text: string }) {
  return level === 3 ? (
    <h3 className="font-serif text-3xl">{text}</h3>
  ) : (
    <h4 className="font-serif text-2xl">{text}</h4>
  );
}
