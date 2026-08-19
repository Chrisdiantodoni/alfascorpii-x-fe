import { Check, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface ShareButtonProps {
	title: string;
	text?: string;
	url?: string;
	className?: string;
}

export function ShareButton({
	title,
	text,
	url,
	className = "",
}: ShareButtonProps) {
	const [copied, setCopied] = useState(false);

	const shareUrl =
		url ?? (typeof window !== "undefined" ? window.location.href : "");
	const shareText = text ?? title;

	const handleShare = async () => {
		if (!shareUrl) return;

		if (typeof navigator !== "undefined" && "share" in navigator) {
			try {
				await navigator.share({ title, text: shareText, url: shareUrl });
				return;
			} catch {
				// User membatalkan share / tidak ada app penerima — lanjut ke fallback copy
			}
		}

		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			window.prompt("Salin tautan:", shareUrl);
		}
	};

	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			type="button"
			aria-label="Bagikan"
			onClick={handleShare}
			className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-paper/90 backdrop-blur border border-line text-gray-400 dark:text-gray-500 transition-colors hover:text-ink dark:hover:text-gray-200 hover:border-ink dark:hover:border-gray-300 ${className}`}
		>
			{copied ? (
				<Check size={18} className="text-green-500" />
			) : (
				<Share2 size={18} />
			)}
		</motion.button>
	);
}
