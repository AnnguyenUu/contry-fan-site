import { createRequest } from "@/shared/api/request-builder";
import { countriesEnvelopeSchema } from "../domain/country.schema";
import { toCountryDetails, toCountrySummary } from "../domain/country.mapper";
import type { CountryDetails, CountrySummary } from "../domain/country.types";

function parseOrThrow(raw: unknown, context: string) {
  try {
    return countriesEnvelopeSchema.parse(raw);
  } catch {
    throw new Error(`RestCountries returned an unexpected response shape for ${context}.`);
  }
}

export async function searchCountries(query: string): Promise<CountrySummary[]> {
  const raw = await createRequest("").withParams({ q: query }).send();
  const parsed = parseOrThrow(raw, "a country search");
  return parsed.data.objects.map(toCountrySummary);
}

export async function getCountryDetails(code: string): Promise<CountryDetails> {
  const raw = await createRequest(`/codes.alpha_3/${code}`).send();
  const parsed = parseOrThrow(raw, "country details");
  const [country] = parsed.data.objects;
  if (!country) {
    throw new Error(`No country found for code "${code}".`);
  }
  return toCountryDetails(country);
}
