# Movie Fan Site

Search movies via [TheMovieDB (TMDB)](https://www.themoviedb.org/), favourite them, organise favourites into your own named groups, and pick up right where you left off on reload.

React 19 + TypeScript, client-side SPA (Vite) with one small serverless function to keep the TMDB API key off the browser — see [Architecture](#architecture).

## Quick start

Requires **Node 20+** (built and tested on Node 20.20.2) and npm.

```bash
npm install
cp .env.example .env   # then fill in API_KEY — see below
npm run dev
```

Open the printed local URL. `/` is the search page, `/favorites` is your favourites & groups, `/movies/:movieId` is a movie's detail page.

### Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Notes |
|---|---|---|
| `API_KEY` | Yes, to search | A free [TMDB v4 Read Access Token](https://www.themoviedb.org/settings/api). Attached to upstream requests **only inside the Vite dev-server proxy** (`vite.config.ts`) locally, and inside `api/movies/[...path].ts` in production — it's never sent to the browser or visible in client code/devtools. Without it, the app still runs; searches show a friendly "add your API key" error instead of crashing. |
| `VITE_API_BASE_URL` | No | This app's own relative proxy path, defaults to `/api/movies`. Only change it if you rename the `api/movies` route. |

`.env` is gitignored.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR (and the TMDB proxy) |
| `npm run build` | `tsc -b` (typecheck, no emit) then `vite build` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | `oxlint` over the project |
| `npm run test` | `vitest run` — single pass, CI-friendly |
| `npm run test:watch` | `vitest` in watch mode |

A **pre-commit hook** (Husky + lint-staged) runs `oxlint --deny-warnings` against staged files on every commit — see [Linting & the pre-commit hook](#linting--the-pre-commit-hook). A GitHub Actions workflow (`.github/workflows/ci.yml`) runs lint, test, and build on every push/PR.

## Architecture

Domain-driven modules under `src/modules/<feature>/`, each layer with one job and a strict call direction:

```
presentation  →  core/handlers  →  repository
                 core/store (state shared across a subtree — here, favorites/groups)
```

```
src/modules/movies/
  repository/       # calls this app's own /api/movies/* route via RequestBuilder, validates + maps responses
  core/
    handlers/        # React Query hooks (useSearchMovies, useMovieDetails) wrapping the repository
    store/            # context()-based provider sharing favorites/groups state across the app
  domain/            # types (MovieSummary, MovieDetails, Group, FavoriteMovie), Zod schemas, raw→domain mapping
  presentation/      # UI components — never call the repository directly
  configuration/     # query keys, storage keys, image-URL helpers
```

A component is never allowed to skip a layer (no calling the repository or `fetch` directly from a component).

### How the API key stays server-side — in dev and in production

`vite.config.ts` proxies `/api/movies/*` to `https://api.themoviedb.org/3/*` in dev, attaching `Authorization: Bearer <API_KEY>` inside the proxy config, server-side. `api/movies/[...path].ts` is a Vercel serverless function that does the *exact same thing* (same prefix stripped, same upstream, same header injection) using `API_KEY` as a Vercel environment variable, so the deployed app works identically. The repository layer only ever calls the relative path `/api/movies/...` — it has no idea whether that's being resolved by the dev proxy or the deployed function, so swapping one for the other needs zero frontend changes.

This deliberately closes a gap that's easy to leave open when building against a keyed API under a time limit: a dev-only proxy that quietly stops working the moment the app is actually hosted.

## Why these choices

- **TanStack React Query**, not manual `useEffect` fetching. All server-state (loading/error/cache/retry) goes through it; components only ever see `.data`/`.isLoading`/`.isError`. It's also what makes the search/detail tests fast and reliable — mocking one repository function under a `QueryClientProvider` is enough to test an entire page.
- **Zod**, to validate TMDB's response shape at the repository boundary before mapping it into this app's own domain types (`domain/movie.types.ts`). Third-party APIs change shape without warning; a `.parse()` that throws on drift is safer than trusting `any` and finding out at render time.
- **Axios wrapped by a `RequestBuilder`** (`createRequest(url).withParams(...).send()`), not `fetch` directly. Repositories never import `axios`; they only see the builder. This centralizes the base URL, timeout, and error normalization (a `401` gets turned into "check your API key", anything else into a generic retry-able message) in one place instead of repeating try/catch in every repository function.
- **A custom `context()` factory** (`src/shared/lib/context.tsx`) instead of Zustand/Redux. The app only needs one small piece of state shared across the tree: the favorites + groups list. A full global-store library would be more machinery than the problem needs. `context()` is a thin, reusable wrapper: give it a hook, get back a type-safe `[Provider, useContextHook]` pair that throws a clear error if used outside its provider.
- **`localStorage` via a small generic `useLocalStorage` hook**, not a database. There's no user account system in scope, so per-browser persistence is the right amount of storage for the requirement ("the user can return to the site to see and continue favouriting"). The read/write is wrapped in try/catch — a private-browsing storage failure degrades to in-memory-only state for that session instead of crashing the app.
- **Vitest + React Testing Library**, not Jest. Vitest reads `vite.config.ts` directly (`/// <reference types="vitest/config" />`), so tests automatically get the exact same path aliases and env resolution as the real app — no separate Jest config to keep in sync.
- **oxlint**, not ESLint. Oxc-based, effectively instant even as the project grows, with an ESLint-compatible rule set (`react/rules-of-hooks`, `jsx-a11y`, `vitest`, etc.) — a good fit for a pre-commit hook where lint time directly taxes every commit.
- **`react-router-dom`**, not a hand-rolled page switch. Real routes (`/`, `/favorites`, `/movies/:id`) mean deep links to a specific movie work, browser back/forward behaves correctly, and `NavLink` gives free active-state styling — all things a raw "swap component on click" approach doesn't get you.

### Data model

- A `MovieSummary`/`MovieDetails` (mapped from TMDB, not TMDB's raw snake_case shape) is what the UI renders.
- A `FavoriteMovie` is a small, self-contained snapshot (`movieId`, `title`, `posterPath`, `releaseYear`, `groupId`, `addedAt`) stored in `localStorage` — it doesn't re-fetch from TMDB to render the favourites list, so favourites still show correctly even offline or if TMDB is briefly down.
- A `Group` is just `{ id, name, createdAt }`. Deleting a group un-assigns its favourites back to "Ungrouped" rather than deleting the favourites themselves — deleting a *favourite* and deleting a *group* are treated as genuinely separate actions, per the requirement that both be independently possible.

## Testing

Tests are co-located as `*.test.ts(x)` next to the file under test (`npm run test`). The strategy is to mock at the **repository boundary** (`vi.mock("@/modules/movies/repository/movies.repository")`) for page-level tests, not deeper — tests exercise real React Query caching and real component rendering, with only the actual HTTP call replaced. The favorites/groups store and the `useLocalStorage` hook are tested directly via `renderHook`, since their whole job is state logic, not rendering.

## Linting & the pre-commit hook

`.husky/pre-commit` runs `npx lint-staged`, which runs `oxlint --deny-warnings` against staged files only. The `--deny-warnings` flag matters: oxlint's default exit code is 0 whenever there are only warnings (e.g. `jsx-a11y` accessibility warnings) and no hard errors, which means a plain `oxlint` invocation in a pre-commit hook would silently let warnings through. `--deny-warnings` makes warnings fail the commit too.

## Trade-offs made for the time limit

- **No drag-and-drop for grouping.** Movies are assigned to a group via a `<select>` dropdown rather than a drag-and-drop interface. Fully accessible and keyboard-operable out of the box; a drag-and-drop version would need its own keyboard-equivalent to meet the same bar, which wasn't worth the time trade-off here.
- **No group renaming.** Groups can be created and deleted, per the requirement, but not renamed — the requirement didn't ask for it and it's a small addition, not an architectural one.
- **One JS bundle, no route-level code splitting.** `npm run build` warns that the main chunk is ~620KB (196KB gzipped). Fine for this exercise's scope; see [If I had more time](#if-i-had-more-time).
- **Pagination isn't wired up.** TMDB's search returns `totalPages`, and the repository/hook already return it, but the search page only ever requests page 1. Deliberately deferred — infinite scroll or page controls are a real feature, not a quick addition.

## If I had more time

- Wire up pagination / infinite scroll on the search page (the plumbing for it already exists in `SearchMoviesResult`).
- Code-split routes with `React.lazy` to shrink the initial bundle.
- Let groups be renamed and reordered.
- Add E2E coverage (Playwright) for the full favourite → group → delete flow, since current tests are unit/integration only.
- Debounce-cancel in-flight requests more aggressively (React Query already dedupes by query key, but an `AbortController` tied to the debounce would save a few wasted requests while typing quickly).
- Surface TMDB rate-limit responses (`429`) with a distinct, more specific message than the generic network-error state.
