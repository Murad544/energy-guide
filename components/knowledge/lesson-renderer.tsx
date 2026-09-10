import { CalloutBlock } from "@/components/knowledge/blocks/callout-block";
import { HeadingBlock } from "@/components/knowledge/blocks/heading-block";
import { ListBlock } from "@/components/knowledge/blocks/list-block";
import { ParagraphBlock } from "@/components/knowledge/blocks/paragraph-block";
import type { ContentBlock } from "@/types/lesson";

export function LessonRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="grid gap-8">
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;
        if (block.kind === "paragraph")
          return <ParagraphBlock key={key} text={block.text} />;
        if (block.kind === "heading")
          return (
            <HeadingBlock key={key} level={block.level} text={block.text} />
          );
        if (block.kind === "list")
          return (
            <ListBlock key={key} items={block.items} style={block.style} />
          );
        if (block.kind === "callout")
          return <CalloutBlock key={key} text={block.text} tone={block.tone} />;
        if (block.kind === "steps")
          return (
            <ol className="grid gap-4" key={key}>
              {block.items.map((item) => (
                <li className="border p-5" key={item.num}>
                  <span className="text-sm text-copper">{item.num}</span>
                  <strong className="mt-2 block font-serif text-xl">
                    {item.title}
                  </strong>
                  <p className="mt-2 text-ink-soft">{item.body}</p>
                </li>
              ))}
            </ol>
          );
        return null;
      })}
    </div>
  );
}
