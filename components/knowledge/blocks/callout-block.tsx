export function CalloutBlock({
  text,
  tone,
}: {
  text: string;
  tone: "info" | "warn";
}) {
  return (
    <aside
      className={
        tone === "warn"
          ? "border-l-4 border-copper bg-paper-dim p-5"
          : "border-l-4 border-teal bg-paper-dim p-5"
      }
    >
      {text}
    </aside>
  );
}
