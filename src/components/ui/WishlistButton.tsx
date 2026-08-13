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
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full  bg-paper/90 backdrop-blur transition-colors ${
        isFavorite
          ? "border-red-500/50 dark:border-red-500/80 text-red-500 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20"
          : "border-line text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-500/50"
      } ${className}`}
    >
      <Heart size={18} className={isFavorite ? "fill-current" : ""} />
    </motion.button>
  );
}
