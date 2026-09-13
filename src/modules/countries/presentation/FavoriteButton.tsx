import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  isFavorite: boolean;
  name: string;
  onToggle: () => void;
}

export function FavoriteButton({ isFavorite, name, onToggle }: FavoriteButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${name} from favourites` : `Add ${name} to favourites`}
      onClick={onToggle}
      className="rounded-full bg-white/90 p-2 text-red-500 shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:bg-slate-900/80 dark:hover:bg-slate-900"
    >
      <Heart aria-hidden="true" className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} strokeWidth={2} />
    </motion.button>
  );
}
