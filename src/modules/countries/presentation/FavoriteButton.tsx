import { motion } from "framer-motion";

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
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.25c-.34 0-.67-.11-.94-.32C7.14 17.06 3 13.3 3 9.28 3 6.6 5.1 4.5 7.75 4.5c1.53 0 2.98.73 3.88 1.94l.37.5.37-.5c.9-1.21 2.35-1.94 3.88-1.94 2.65 0 4.75 2.1 4.75 4.78 0 4.02-4.14 7.78-8.06 10.65-.27.21-.6.32-.94.32Z"
        />
      </svg>
    </motion.button>
  );
}
