export function ListBlock({
  items,
  style,
}: {
  items: string[];
  style: "bullet" | "check" | "cross";
}) {
  const marker = style === "check" ? "✓" : style === "cross" ? "×" : "—";
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li className="flex gap-3 leading-7" key={item}>
          <span className="text-amber-dim">{marker}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
