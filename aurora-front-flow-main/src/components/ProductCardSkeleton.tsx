const ProductCardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
      <div className="aspect-square bg-surface-2" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 rounded bg-surface-3" />
        <div className="h-4 w-full rounded bg-surface-3" />
        <div className="h-4 w-3/4 rounded bg-surface-3" />
        <div className="h-3 w-20 rounded bg-surface-3" />
        <div className="h-5 w-28 rounded bg-surface-3" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
