import { CountryCardSkeleton } from "./CountryCardSkeleton";

const PLACEHOLDER_COUNT = 10;

export function CountryGridSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
        <CountryCardSkeleton key={index} />
      ))}
    </ul>
  );
}
