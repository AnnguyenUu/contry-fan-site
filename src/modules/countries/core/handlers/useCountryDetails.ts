import { useQuery } from "@tanstack/react-query";
import { countryQueryKeys } from "../../configuration/query-keys";
import { getCountryDetails } from "../../repository/countries.repository";

export function useCountryDetails(code: string | undefined) {
  return useQuery({
    queryKey: countryQueryKeys.details(code),
    queryFn: () => getCountryDetails(code as string),
    enabled: Boolean(code),
  });
}
