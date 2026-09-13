export interface CountrySummary {
  code: string; // alpha_3, e.g. "CAN"
  commonName: string;
  officialName: string;
  flagEmoji: string;
  flagPngUrl: string;
  region: string;
  subregion: string | null;
  capital: string | null;
  population: number;
}

export interface CountryDetails extends CountrySummary {
  flagSvgUrl: string | null;
  flagDescription: string | null;
  areaKm2: number | null;
  languages: string[];
  currencies: { code: string; name: string; symbol: string | null }[];
  borders: string[];
  continents: string[];
  shortDescription: string | null;
  wikipediaUrl: string | null;
}

export interface Group {
  id: string;
  name: string;
  createdAt: string;
}

export interface FavoriteCountry {
  countryCode: string;
  commonName: string;
  flagEmoji: string;
  flagPngUrl: string;
  region: string;
  groupId: string | null;
  addedAt: string;
}
