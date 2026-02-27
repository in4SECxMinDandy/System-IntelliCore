import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number;
  images?: { url: string; isPrimary?: boolean }[];
  category?: { name: string };
  purchaseCount?: number;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
