import { Link, useParams } from "react-router-dom";
import { backdropUrl, posterUrl } from "@/modules/movies/configuration/constants";
import { useMovieDetails } from "@/modules/movies/core/handlers/useMovieDetails";
import { useFavoritesStore } from "@/modules/movies/core/store/favorites.store";
import { FavoriteButton } from "@/modules/movies/presentation/FavoriteButton";
import { ErrorState } from "@/shared/presentation/ErrorState";
import { LoadingState } from "@/shared/presentation/LoadingState";

export function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const numericId = movieId ? Number(movieId) : undefined;
  const { data: movie, isLoading, isError, error, refetch } = useMovieDetails(numericId);
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  return (
    <div className="flex flex-col gap-4">
      <Link to="/" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        ← Back to search
      </Link>

      {isLoading ? (
        <LoadingState label="Loading movie…" />
      ) : isError || !movie ? (
        <ErrorState
          message={error instanceof Error ? error.message : "Movie not found."}
          onRetry={() => refetch()}
        />
      ) : (
        <article className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          {backdropUrl(movie.backdropPath) ? (
            <img
              src={backdropUrl(movie.backdropPath) ?? undefined}
              alt=""
              className="h-48 w-full object-cover sm:h-64"
            />
          ) : null}
          <div className="flex flex-col gap-4 p-6 sm:flex-row">
            <div className="w-40 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
              {posterUrl(movie.posterPath) ? (
                <img src={posterUrl(movie.posterPath) ?? undefined} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{movie.title}</h1>
                  {movie.tagline ? (
                    <p className="italic text-slate-500 dark:text-slate-400">{movie.tagline}</p>
                  ) : null}
                </div>
                <FavoriteButton
                  isFavorite={isFavorite(movie.id)}
                  title={movie.title}
                  onToggle={() => toggleFavorite(movie)}
                />
              </div>
              <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
                <div>
                  <dt className="sr-only">Release year</dt>
                  <dd>{movie.releaseYear}</dd>
                </div>
                {movie.runtimeMinutes ? (
                  <div>
                    <dt className="sr-only">Runtime</dt>
                    <dd>{movie.runtimeMinutes} min</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="sr-only">Rating</dt>
                  <dd>★ {movie.voteAverage.toFixed(1)}</dd>
                </div>
              </dl>
              {movie.genres.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <li
                      key={genre}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    >
                      {genre}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{movie.overview}</p>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
