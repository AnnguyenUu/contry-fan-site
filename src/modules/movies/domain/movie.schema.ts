import { z } from "zod";

// Only the fields this app actually reads are validated — TMDB's real
// payloads carry many more, and Zod ignores unspecified keys by default.
export const movieSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string().default(""),
  poster_path: z.string().nullable(),
  release_date: z.string().default(""),
  vote_average: z.number().default(0),
});

export const searchMoviesResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSummarySchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export const movieDetailsSchema = movieSummarySchema.extend({
  runtime: z.number().nullable().optional(),
  tagline: z.string().nullable().optional(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })).default([]),
  backdrop_path: z.string().nullable().optional(),
});

export type MovieSummaryRaw = z.infer<typeof movieSummarySchema>;
export type MovieDetailsRaw = z.infer<typeof movieDetailsSchema>;
