import { Fragment, type ReactNode } from "react";

/**
 * Renders the small text format used by the legal pages (edited in the dashboard):
 * "## " starts a heading, "- " a bullet, a blank line a new paragraph, **text** is bold.
 * Email addresses and https:// links become links. No HTML is ever interpreted.
 */
export function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) blocks.push(<p key={blocks.length} className="m-0">{inline(para.join(" "))}</p>);
    para = [];
  };
  const flushList = () => {
    if (bullets.length) {
      blocks.push(
        <ul key={blocks.length} className="m-0 flex list-disc flex-col gap-2 ps-6">
          {bullets.map((b, i) => <li key={i}>{inline(b)}</li>)}
        </ul>,
      );
    }
    bullets = [];
  };

  for (const raw of text.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
    } else if (line.startsWith("## ")) {
      flushPara();
      flushList();
      blocks.push(<h2 key={blocks.length} className="m-0 mt-4 text-[clamp(22px,2.2vw,28px)] font-semibold tracking-[-0.01em] text-ink">{inline(line.slice(3))}</h2>);
    } else if (/^[-•]\s/.test(line)) {
      flushPara();
      bullets.push(line.slice(2).trim());
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return <>{blocks}</>;
}

const TOKEN = /(\*\*[^*]+\*\*|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|https:\/\/[^\s)]+)/g;

function inline(s: string): ReactNode {
  return s.split(TOKEN).map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
    if (/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(part)) return <a key={i} href={`mailto:${part}`} className="text-accent">{part}</a>;
    if (part.startsWith("https://")) return <a key={i} href={part} rel="noreferrer" className="text-accent">{part}</a>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}
