import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/mock-data";

interface OrderRow {
  id: string;
  total: number;
  status: string;
  payment_method: string;
  shipping_address: any;
  created_at: string;
}

interface OrderItemRow {
  id: string;
  quantity: number;
  price: number;
  products: { name: string; image: string; slug: string } | null;
}

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: "Đang xử lý", className: "bg-warning/10 text-warning" },
  confirmed: { label: "Đã xác nhận", className: "bg-primary/10 text-primary" },
  shipping: { label: "Đang giao", className: "bg-accent/10 text-accent" },
  completed: { label: "Hoàn thành", className: "bg-success/10 text-success" },
  cancelled: { label: "Đã hủy", className: "bg-destructive/10 text-destructive" },
};

const OrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as OrderRow[]) || []);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!selectedOrder) return;
    supabase
      .from("order_items")
      .select("id, quantity, price, products(name, image, slug)")
      .eq("order_id", selectedOrder)
      .then(({ data }) => {
        setOrderItems((data as unknown as OrderItemRow[]) || []);
      });
  }, [selectedOrder]);

  if (authLoading) return <div className="container-main py-20 text-center text-muted-foreground">Đang tải...</div>;

  if (!user) {
    return (
      <div className="container-main py-20 text-center">
        <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Vui lòng đăng nhập</h1>
        <p className="text-muted-foreground mb-6">Bạn cần đăng nhập để xem lịch sử đơn hàng.</p>
        <Link to="/login"><Button size="lg" className="rounded-xl">Đăng nhập</Button></Link>
      </div>
    );
  }

  if (loading) return <div className="container-main py-20 text-center text-muted-foreground">Đang tải đơn hàng...</div>;

  if (orders.length === 0) {
    return (
      <div className="container-main py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Chưa có đơn hàng</h1>
        <p className="text-muted-foreground mb-6">Hãy mua sắm và đặt hàng đầu tiên!</p>
        <Link to="/products"><Button size="lg" className="rounded-xl">Mua sắm ngay</Button></Link>
      </div>
    );
  }

  const selected = orders.find((o) => o.id === selectedOrder);

  return (
    <div className="container-main py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Đơn hàng của tôi</h1>
      <p className="text-muted-foreground mb-8">{orders.length} đơn hàng</p>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order list */}
        <div className="lg:col-span-2 space-y-3">
          {orders.map((order, i) => {
            const st = statusLabels[order.status] || statusLabels.pending;
            const addr = order.shipping_address as any;
            return (
              <motion.button
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedOrder(order.id === selectedOrder ? null : order.id)}
                className={`w-full text-left rounded-2xl border p-5 transition-all ${
                  selectedOrder === order.id
                    ? "border-primary bg-primary/5 shadow-card-hover"
                    : "border-border bg-card shadow-card hover:shadow-card-hover"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground">#{order.id.slice(0, 8)}</span>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${st.className}`}>{st.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-card-foreground font-medium">{addr?.fullName || "—"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{formatPrice(order.total)}</span>
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${selectedOrder === order.id ? "rotate-90" : ""}`} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Order detail */}
        <div className="lg:col-span-1">
          {selected ? (
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
              <h2 className="text-sm font-bold text-card-foreground">Chi tiết đơn hàng</h2>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Địa chỉ giao hàng</p>
                <p className="text-sm text-card-foreground">{(selected.shipping_address as any)?.fullName}</p>
                <p className="text-xs text-muted-foreground">{(selected.shipping_address as any)?.phone}</p>
                <p className="text-xs text-muted-foreground">
                  {(selected.shipping_address as any)?.address}, {(selected.shipping_address as any)?.district}, {(selected.shipping_address as any)?.city}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Thanh toán</p>
                <p className="text-sm text-card-foreground capitalize">{selected.payment_method}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Sản phẩm</p>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-2">
                      {item.products?.image && (
                        <img src={item.products.image} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-card-foreground truncate">{item.products?.name || "Sản phẩm"}</p>
                        <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <span className="text-xs font-medium text-primary">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-sm font-semibold text-card-foreground">Tổng</span>
                <span className="text-lg font-bold text-primary">{formatPrice(selected.total)}</span>
              </div>
            </div>
          ) : (
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card text-center text-sm text-muted-foreground">
              Chọn đơn hàng để xem chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
