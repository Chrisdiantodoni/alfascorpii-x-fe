import { marked } from "marked";
import { useEffect, useMemo, useState } from "react";
import DOMPurify from "#/lib/dompurify";
import { cn } from "#/lib/utils";
import { getMarkdownPresignedUrls } from "#/server/cms";

marked.setOptions({
  breaks: true,
  gfm: true,
});

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const UPLOAD_SRC_RE = /src\s*=\s*["']([^"']*uploads\/[^"']+)["']/gi;

function extractUploadPaths(content: string): string[] {
  if (!content) return [];
  return Array.from(content.matchAll(UPLOAD_SRC_RE), (m) => m[1]);
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const uploadPaths = useMemo(() => extractUploadPaths(content), [content]);
  const [urlMap, setUrlMap] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (uploadPaths.length === 0) {
      setUrlMap({});
      return;
    }

    let mounted = true;
    getMarkdownPresignedUrls({ data: { paths: uploadPaths } })
      .then((map) => {
        if (mounted) setUrlMap(map ?? {});
      })
      .catch(() => {
        if (mounted) setUrlMap({});
      });

    return () => {
      mounted = false;
    };
  }, [uploadPaths]);

  const html = useMemo(() => {
    if (!content) return "";

    // 1. Parse markdown
    const parsed = marked.parse(content.replace(/\\n/g, "\n")) as string;

    // 2. Olah semua tag <img> (baik yang punya width maupun tidak)
    const processedImg = parsed.replace(/<img\b[^>]*>/gi, (imgTag) => {
      // Cek apakah ada atribut width (misal: width="200" atau width='200')
      const widthMatch = imgTag.match(/\bwidth=(["']?)(\d+)\1/i);
      const widthValue = widthMatch ? widthMatch[2] : null;

      // Tentukan style width berdasarkan kondisi
      const styleWidth = widthValue ? `${widthValue}px` : "100%";

      // Jika imgTag sudah punya atribut style, gabungkan style-nya
      if (/style=/i.test(imgTag)) {
        return imgTag.replace(
          /style=(["'])(.*?)\1/i,
          `style="$2; width:${styleWidth}; max-width:100%; height:auto;"`,
        );
      }

      // Jika belum punya style, selipkan atribut style di akhir tag
      return imgTag.replace(
        ">",
        ` style="width:${styleWidth}; max-width:100%; height:auto;">`,
      );
    });

    // 3. Ganti src uploads/... menjadi presigned URL ("" saat belum siap)
    const withPresigned = (processedImg as string).replace(
      UPLOAD_SRC_RE,
      (_match, path: string) => `src="${urlMap?.[path] ?? ""}"`,
    );

    const withLazy = withPresigned.replace(/<img\b/gi, '<img loading="lazy"');

    // 4. Sanitasi HTML dengan DOMPurify (mengizinkan atribut style & data-align)
    return DOMPurify.sanitize(withLazy, {
      ADD_ATTR: ["target", "data-align", "style"],
    });
  }, [content, urlMap]);

  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none md-preview",
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
