interface CountryDetailImageProps {
  src: string;
}

export function CountryDetailImage({ src }: CountryDetailImageProps) {
  return (
    <div className="flex max-h-56 items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-700">
      <img src={src} alt="" className="w-full object-cover" />
    </div>
  );
}
