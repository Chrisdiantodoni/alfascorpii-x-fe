import { marked } from "marked";
import DOMPurify from "dompurify";
import { useMemo } from "react";
import { cn } from "#/lib/utils";

// Inisialisasi konfigurasi marked
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

    // 1. Parse markdown
    const parsed = marked.parse(content.replace(/\\n/g, "\n")) as string;

    // 2. Inject inline style ke tag img
    const processedImg = parsed.replace(
      /<img\b(?=[^>]*\bwidth=(["']?)(\d+)\1)[^>]*>/gi,
      (match) => {
        const widthMatch = match.match(/width=(["']?)(\d+)\1/i);
        const width = widthMatch ? widthMatch[2] : null;

        if (!width) return match;

        // Cegah duplikasi style attribute jika sudah ada
        if (/style=/i.test(match)) {
          return match.replace(
            /style=(["'])(.*?)\1/i,
            `style="$2; width:${width}px; max-width:100%; height:auto;"`,
          );
        }

        return match.replace(
          ">",
          ` style="width:${width}px; max-width:100%; height:auto;">`,
        );
      },
    );

    // 3. Sanitasi HTML untuk mencegah XSS (SANGAT DIREKOMENDASIKAN)
    return DOMPurify.sanitize(processedImg, {
      ADD_ATTR: ["target", "data-align"], // izinkan atribut custom yang digunakan CSS
    });
  }, [content]);

  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none md-preview",
        // Pindahkan CSS ke Utility Class Tailwind via Tailwind Arbitrary Variants
        "[&_[data-align='center']]:text-center",
        "[&_[data-align='center']_figure]:inline-block",
        "[&_figure[data-align='left']]:float-left [&_figure[data-align='left']]:mr-4 [&_figure[data-align='left']]:mb-2",
        "[&_figure[data-align='right']]:float-right [&_figure[data-align='right']]:ml-4 [&_figure[data-align='right']]:mb-2",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
