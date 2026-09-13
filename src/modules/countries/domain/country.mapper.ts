import type { CountryObjectRaw } from "./country.schema";
import type { CountryDetails, CountrySummary } from "./country.types";

export function toCountrySummary(raw: CountryObjectRaw): CountrySummary {
  return {
    code: raw.codes.alpha_3,
    commonName: raw.names.common,
    officialName: raw.names.official,
    flagEmoji: raw.flag.emoji,
    flagPngUrl: raw.flag.url_png,
    region: raw.region,
    subregion: raw.subregion ?? null,
    capital: raw.capitals[0]?.name ?? null,
    population: raw.population,
  };
}

export function toCountryDetails(raw: CountryObjectRaw): CountryDetails {
  return {
    ...toCountrySummary(raw),
    flagSvgUrl: raw.flag.url_svg ?? null,
    flagDescription: raw.flag.description ?? null,
    areaKm2: raw.area?.kilometers ?? null,
    languages: raw.languages.map((language) => language.name),
    currencies: raw.currencies.map((currency) => ({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol ?? null,
    })),
    borders: raw.borders,
    continents: raw.continents,
    shortDescription: raw.descriptions?.short ?? null,
    wikipediaUrl: raw.links?.wikipedia ?? null,
  };
}
