import { useQuery } from "@tanstack/react-query";
import { countryQueryKeys } from "@/modules/countries/configuration/query-keys";
import { searchCountries } from "@/modules/countries/repository/countries.repository";

export function useSearchCountries(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: countryQueryKeys.search(trimmed),
    queryFn: () => searchCountries(trimmed),
    enabled: trimmed.length > 0,
    placeholderData: (previous) => previous,
  });
}
