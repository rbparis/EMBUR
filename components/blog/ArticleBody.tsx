export default function ArticleBody({ content }: { content: string }) {
  const lines = content.split(/\r?\n/);

  return (
    <div className="space-y-5 text-[1.05rem] leading-8 text-[#394b68]">
      {lines.map((line, index) => {
        const text = line.trim();
        if (!text) return <div key={index} className="h-1" />;
        if (text.startsWith("# ")) {
          return null;
        }
        if (text.startsWith("## ")) {
          return (
            <h2 key={index} className="font-display pt-5 text-2xl font-semibold text-[#06142f] md:text-3xl">
              {text.slice(3)}
            </h2>
          );
        }
        if (/^[-*]\s/.test(text)) {
          return (
            <div key={index} className="flex gap-3 pl-2">
              <span aria-hidden className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#ff6a3d]" />
              <p>{text.slice(2)}</p>
            </div>
          );
        }
        if (/^\d+\.\s/.test(text)) {
          const number = text.match(/^\d+/)?.[0] ?? "";
          return (
            <div key={index} className="flex gap-3 pl-2">
              <span className="font-extrabold text-[#1555c6]">{number}.</span>
              <p>{text.replace(/^\d+\.\s*/, "")}</p>
            </div>
          );
        }
        return <p key={index}>{text}</p>;
      })}
    </div>
  );
}
