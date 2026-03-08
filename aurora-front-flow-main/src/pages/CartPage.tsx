import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/mock-data";

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-main py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Giỏ hàng trống</h1>
        <p className="text-muted-foreground mb-6">Hãy thêm sản phẩm yêu thích vào giỏ hàng!</p>
        <Link to="/products">
          <Button size="lg" className="gap-2 rounded-xl">
            Tiếp tục mua sắm <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Giỏ hàng <span className="text-muted-foreground text-lg font-normal">({totalItems} sản phẩm)</span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-card"
              >
                <Link to={`/products/${item.product.slug}`} className="shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <Link to={`/products/${item.product.slug}`} className="text-sm font-medium text-card-foreground hover:text-primary transition-colors line-clamp-2">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">{item.product.category}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-3">
                    <div className="flex items-center rounded-lg border border-input">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center hover:bg-muted transition-colors rounded-l-lg"
                        aria-label="Giảm"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="flex h-8 w-10 items-center justify-center border-x border-input text-xs font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center hover:bg-muted transition-colors rounded-r-lg"
                        aria-label="Tăng"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-primary whitespace-nowrap">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                      aria-label="Xóa sản phẩm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-bold text-card-foreground mb-4">Tổng đơn hàng</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="text-card-foreground font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vận chuyển</span>
                <span className="text-success font-medium">Miễn phí</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-base font-semibold text-card-foreground">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button size="lg" className="w-full gap-2 rounded-xl">
                Thanh toán <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/products" className="mt-3 block text-center text-sm text-muted-foreground hover:text-primary transition-colors">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
