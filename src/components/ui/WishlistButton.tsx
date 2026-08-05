// owned by: italfa:staff
import { useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useSession } from "#/lib/auth-client";
import { useWishlistStore } from "#/stores/wishlist";

interface WishlistButtonProps {
	productId: string;
	className?: string;
}

export function WishlistButton({
	productId,
	className = "",
}: WishlistButtonProps) {
	const navigate = useNavigate();
	const { data: session } = useSession();
	const isFavorite = useWishlistStore((s) => s.isFavorite(productId));
	const toggle = useWishlistStore((s) => s.toggle);

	const handleClick = async () => {
		if (!session) {
			await navigate({ to: "/login" });
			return;
		}
		await toggle(productId);
	};

	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			type="button"
			aria-label={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
			aria-pressed={isFavorite}
			onClick={handleClick}
			className={`inline-flex items-center justify-center w-10 h-10 rounded-full border bg-paper/90 backdrop-blur transition-colors ${
				isFavorite
					? "border-red-400 text-red-500"
					: "border-line text-ink hover:text-red-500 hover:border-red-300"
			} ${className}`}
		>
			<Heart size={18} className={isFavorite ? "fill-current" : ""} />
		</motion.button>
	);
}
