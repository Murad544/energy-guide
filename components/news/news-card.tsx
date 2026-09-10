import { ExternalLink } from "lucide-react";

type NewsCardProps = {
  title: string;
  text: string;
  link?: { title: string; source: string; url: string };
};

export function NewsCard({ title, text, link }: NewsCardProps) {
  return (
    <article className="border p-6">
      <h2 className="font-serif text-3xl">{title}</h2>
      <p className="mt-3 leading-7 text-ink-soft">{text}</p>
      {link ? (
        <a
          className="mt-8 flex items-end justify-between border-t pt-5"
          href={link.url}
          rel="noreferrer"
          target="_blank"
        >
          <span>
            <strong className="block font-medium">{link.title}</strong>
            <span className="mt-1 block text-sm text-ink-soft">
              {link.source}
            </span>
          </span>
          <ExternalLink size={18} />
        </a>
      ) : null}
    </article>
  );
}
