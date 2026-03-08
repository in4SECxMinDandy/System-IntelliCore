import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, GitCompareArrows } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { formatPrice, getDiscountPercent } from "@/lib/mock-data";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCompare } from "@/hooks/use-compare";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const wishlisted = isInWishlist(product.id);
  const comparing = isInCompare(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/products/${product.slug}`}
        className="group block rounded-2xl border border-border bg-card overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-surface-2">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
              {product.badge}
            </span>
          )}

          {/* Hover actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
              className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm shadow-sm transition-colors ${wishlisted ? "bg-primary text-primary-foreground" : "bg-background/90 hover:bg-primary hover:text-primary-foreground"}`}
              aria-label="Thêm vào yêu thích"
            >
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                if (comparing) { removeFromCompare(product.id); toast.info("Đã bỏ so sánh"); }
                else { addToCompare(product); toast.success("Đã thêm vào so sánh"); }
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm shadow-sm transition-colors ${comparing ? "bg-primary text-primary-foreground" : "bg-background/90 hover:bg-primary hover:text-primary-foreground"}`}
              aria-label="So sánh"
            >
              <GitCompareArrows className="h-4 w-4" />
            </button>
          </div>

          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <Button
              size="sm"
              className="w-full gap-2 rounded-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Thêm vào giỏ
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <h3 className="text-sm font-medium text-card-foreground line-clamp-2 leading-snug mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="text-xs font-medium text-foreground">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {discount && (
            <span className="mt-1 inline-block text-xs font-medium text-primary">-{discount}%</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
