import { z } from "zod";

// Only the fields this app actually reads are validated — the real payload
// carries many more (translations, flag color palettes, government/fiscal
// year rules, membership flags, etc.), and Zod ignores unspecified keys by
// default. Notably, `leaders` is a paid-plan-gated field on this API and is
// deliberately not modeled or read anywhere in this app.
export const countryObjectSchema = z.object({
  names: z.object({
    common: z.string(),
    official: z.string(),
  }),
  codes: z.object({
    alpha_2: z.string(),
    alpha_3: z.string(),
  }),
  capitals: z
    .array(z.object({ name: z.string() }))
    .default([]),
  flag: z.object({
    emoji: z.string().default(""),
    url_png: z.string(),
    url_svg: z.string().optional(),
    description: z.string().optional(),
  }),
  region: z.string(),
  subregion: z.string().optional(),
  area: z.object({ kilometers: z.number() }).optional(),
  population: z.number().default(0),
  languages: z.array(z.object({ name: z.string() })).default([]),
  currencies: z
    .array(z.object({ code: z.string(), name: z.string(), symbol: z.string().optional() }))
    .default([]),
  borders: z.array(z.string()).default([]),
  continents: z.array(z.string()).default([]),
  descriptions: z.object({ short: z.string().optional(), long: z.string().optional() }).optional(),
  links: z.object({ wikipedia: z.string().optional() }).optional(),
});

export const countriesEnvelopeSchema = z.object({
  data: z.object({
    objects: z.array(countryObjectSchema),
  }),
});

export type CountryObjectRaw = z.infer<typeof countryObjectSchema>;
