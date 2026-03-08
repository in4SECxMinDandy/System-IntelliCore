import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useWishlist } from "@/hooks/use-wishlist";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/mock-data";

const WishlistPage = () => {
  const { user } = useAuth();
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchWishlistProducts = async () => {
      const ids = Array.from(wishlistIds);
      if (ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("products")
        .select("*")
        .in("id", ids);

      if (data) {
        setProducts(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            originalPrice: p.original_price ?? undefined,
            image: p.image,
            category: p.category,
            rating: p.rating ?? 0,
            reviewCount: p.review_count ?? 0,
            badge: p.badge ?? undefined,
            inStock: p.in_stock ?? true,
            description: p.description ?? undefined,
            images: p.images ?? undefined,
          }))
        );
      }
      setLoading(false);
    };
    fetchWishlistProducts();
  }, [user, wishlistIds]);

  if (!user) {
    return (
      <div className="container-main py-20 text-center">
        <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Đăng nhập để xem yêu thích</h1>
        <p className="text-muted-foreground mb-6">Bạn cần đăng nhập để sử dụng tính năng yêu thích.</p>
        <Link to="/login"><Button size="lg" className="rounded-xl">Đăng nhập</Button></Link>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Heart className="h-6 w-6 text-primary" /> Sản phẩm yêu thích ({products.length})
      </h1>
      {loading ? (
        <p className="text-muted-foreground">Đang tải...</p>
      ) : products.length === 0 ? (
        <div className="py-16 text-center">
          <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
          <p className="text-muted-foreground mb-4">Bạn chưa có sản phẩm yêu thích nào.</p>
          <Link to="/products"><Button variant="outline" className="rounded-xl">Khám phá sản phẩm</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
