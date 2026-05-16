export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading page"
      className="mx-auto flex min-h-[50vh] w-full max-w-6xl flex-col items-center justify-center gap-8 px-4 py-16"
    >
      <div className="flex w-full max-w-xl flex-col items-center gap-3">
        <div className="h-10 w-2/5 max-w-xs animate-pulse rounded-lg bg-purple-100" />
        <div className="h-4 w-3/4 max-w-md animate-pulse rounded bg-purple-50" />
      </div>
      <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] animate-pulse rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/80"
          />
        ))}
      </div>
    </div>
  );
}
