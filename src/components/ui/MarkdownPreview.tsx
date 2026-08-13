import { marked } from "marked";
import { useMemo } from "react";
import { cn } from "#/lib/utils";

marked.setOptions({
  breaks: true,
  gfm: true,
});

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const html = useMemo(() => {
    if (!content) return "";
    const raw = marked.parse(content.replace(/\\n/g, "\n")) as string;

    // Inject inline style ke img yang punya width
    return raw.replace(
      /<img\s([^>]*?)\bwidth=(["']?)(\d+)\2([^>]*?)>/gi,
      (match, before, _q, width, after) =>
        `<img ${before}width="${width}"${after} style="width:${width}px;max-width:100%;height:auto;">`,
    );
  }, [content]);

  return (
    <>
      <style>{`
				.md-preview [data-align="center"] { text-align: center; }
				.md-preview [data-align="center"] figure { display: inline-block; }
				.md-preview figure[data-align="left"] {
					float: left;
					margin-right: 1rem;
					margin-bottom: 0.5rem;
				}
				.md-preview figure[data-align="right"] {
					float: right;
					margin-left: 1rem;
					margin-bottom: 0.5rem;
				}

				/* ========================================================= */
				/* FIX KUNCI: Paksa browser membaca atribut width & height   */
				/* ========================================================= */

				/* 1. Jika tag <img> memiliki atribut width */
				// .md-preview img[width] {
				// 	width: attr(width px) !important; /* Untuk browser modern */
				// 	max-width: 100%;
				// 	height: auto;
				// }

				// /* 2. Overrule paksaan 'width: 100%' dari Tailwind .prose */
				// .md-preview img[width],
				// .md-preview img[height] {
				// 	display: inline-block !important;
				// 	width: unset; /* Lepas paksaan width 100% */
				// 	max-width: 100%;
				// }
			`}</style>
      <div
        className={cn(
          "prose prose-sm dark:prose-invert max-w-none md-preview",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
