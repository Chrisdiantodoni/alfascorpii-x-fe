import { marked } from "marked";
import { useMemo } from "react";
import DOMPurify from "#/lib/dompurify";
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

		// 3. Sanitasi HTML dengan DOMPurify (mengizinkan atribut style & data-align)
		return DOMPurify.sanitize(processedImg, {
			ADD_ATTR: ["target", "data-align", "style"],
		});
	}, [content]);

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
