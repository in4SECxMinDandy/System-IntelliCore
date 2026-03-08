import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { products, formatPrice } from "@/lib/mock-data";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import ProductCard from "@/components/ProductCard";
import ReviewSection from "@/components/ReviewSection";
import { toast } from "sonner";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.slug === slug);
  const relatedProducts = products.filter((p) => p.id !== product?.id).slice(0, 4);

  if (!product) {
    return (
      <div className="container-main py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Không tìm thấy sản phẩm</h1>
        <Link to="/products">
          <Button variant="outline">Quay lại cửa hàng</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`Đã thêm ${quantity} "${product.name}" vào giỏ hàng`);
  };

  return (
    <div className="container-main py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/products" className="flex items-center gap-1 hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Sản phẩm
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="overflow-hidden rounded-2xl border border-border bg-surface-1"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover aspect-square"
          />
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col"
        >
          <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-warning text-warning" : "text-muted"}`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviewCount.toLocaleString()} đánh giá)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Shipping info */}
          <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3 mb-6">
            <Truck className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-success">Miễn phí vận chuyển</span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-foreground">Số lượng:</span>
            <div className="flex items-center rounded-lg border border-input">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center hover:bg-muted transition-colors rounded-l-lg"
                aria-label="Giảm số lượng"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-10 w-12 items-center justify-center border-x border-input text-sm font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center hover:bg-muted transition-colors rounded-r-lg"
                aria-label="Tăng số lượng"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button size="lg" className="flex-1 gap-2 rounded-xl" onClick={handleAddToCart}>
              <ShoppingCart className="h-5 w-5" />
              Thêm vào giỏ hàng
            </Button>
            <Button
              variant={isInWishlist(product.id) ? "default" : "outline"}
              size="lg"
              className="rounded-xl"
              aria-label="Thêm vào yêu thích"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      <ReviewSection productId={product.id} />

      {/* Related */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {relatedProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
