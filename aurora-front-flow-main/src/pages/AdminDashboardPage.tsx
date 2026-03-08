import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Package, ShoppingBag, TrendingUp, DollarSign, Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ProductFormDialog from "@/components/admin/ProductFormDialog";
import CouponManager from "@/components/admin/CouponManager";

interface OrderRow {
  id: string;
  total: number;
  status: string;
  created_at: string;
  shipping_address: any;
  payment_method: string;
}

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  category: string;
  description: string | null;
  image: string;
  badge: string | null;
  in_stock: boolean;
}

const AdminDashboardPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [tab, setTab] = useState<"overview" | "products" | "orders" | "coupons">("overview");
  const [editProduct, setEditProduct] = useState<ProductRow | null | undefined>(undefined);
  const [coupons, setCoupons] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchProducts = () => {
    supabase.from("products").select("*").order("created_at", { ascending: false }).then(({ data }) => setProducts((data as ProductRow[]) || []));
  };

  const fetchCoupons = () => {
    supabase.from("coupons").select("*").order("created_at", { ascending: false }).then(({ data }) => setCoupons(data || []));
  };

  useEffect(() => {
    if (isAdmin) {
      supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => setOrders((data as OrderRow[]) || []));
      fetchProducts();
      fetchCoupons();
    }
  }, [isAdmin]);

  if (loading) return <div className="container-main py-20 text-center text-muted-foreground">Đang tải...</div>;
  if (!isAdmin) return null;

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  // Chart data - revenue by day (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const revenueByDay = last7Days.map((day) => ({
    date: day.slice(5),
    revenue: orders.filter((o) => o.created_at.startsWith(day)).reduce((s, o) => s + o.total, 0),
  }));

  const categoryData = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChart = Object.entries(categoryData).map(([name, count]) => ({ name, count }));

  const tabs = [
    { key: "overview" as const, label: "Tổng quan", icon: <BarChart3 className="h-4 w-4" /> },
    { key: "products" as const, label: "Sản phẩm", icon: <Package className="h-4 w-4" /> },
    { key: "orders" as const, label: "Đơn hàng", icon: <ShoppingBag className="h-4 w-4" /> },
    { key: "coupons" as const, label: "Mã giảm giá", icon: <Tag className="h-4 w-4" /> },
  ];

  return (
    <div className="container-main py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Quản lý cửa hàng Stitch IntelliCore</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              tab === t.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Doanh thu", value: formatPrice(totalRevenue), icon: <DollarSign className="h-5 w-5" />, color: "text-primary" },
              { label: "Đơn hàng", value: orders.length, icon: <ShoppingBag className="h-5 w-5" />, color: "text-accent" },
              { label: "Sản phẩm", value: products.length, icon: <Package className="h-5 w-5" />, color: "text-success" },
              { label: "Chờ xử lý", value: pendingOrders, icon: <TrendingUp className="h-5 w-5" />, color: "text-warning" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
                <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="text-sm font-bold text-card-foreground mb-4">Doanh thu 7 ngày qua</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(v: number) => formatPrice(v)} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="text-sm font-bold text-card-foreground mb-4">Sản phẩm theo danh mục</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {tab === "products" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEditProduct(null)} className="rounded-xl">
              <Plus className="h-4 w-4 mr-1" /> Thêm sản phẩm
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ảnh</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tên</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Danh mục</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Giá</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Trạng thái</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      </td>
                      <td className="px-4 py-3 text-card-foreground font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                      <td className="px-4 py-3 text-right text-primary font-medium">{formatPrice(p.price)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${p.in_stock ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                          {p.in_stock ? "Còn hàng" : "Hết hàng"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditProduct(p)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={async () => {
                            if (!confirm("Xóa sản phẩm này?")) return;
                            const { error } = await supabase.from("products").delete().eq("id", p.id);
                            if (error) toast.error("Lỗi xóa sản phẩm");
                            else { toast.success("Đã xóa"); fetchProducts(); }
                          }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {editProduct !== undefined && (
            <ProductFormDialog
              product={editProduct}
              onClose={() => setEditProduct(undefined)}
              onSaved={() => { setEditProduct(undefined); fetchProducts(); }}
            />
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Mã đơn</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Tổng tiền</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Thanh toán</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Chưa có đơn hàng</td></tr>
                ) : orders.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 text-card-foreground font-mono text-xs">{o.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-right text-primary font-medium">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={o.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", o.id);
                          if (error) {
                            toast.error("Lỗi cập nhật trạng thái");
                          } else {
                            setOrders((prev) => prev.map((ord) => ord.id === o.id ? { ...ord, status: newStatus } : ord));
                            toast.success(`Đã cập nhật thành "${newStatus}"`);
                          }
                        }}
                        className={`rounded-full px-2 py-0.5 text-xs font-medium border-0 cursor-pointer bg-muted text-card-foreground`}
                      >
                        {["pending", "confirmed", "shipping", "completed", "cancelled"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{o.payment_method}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString("vi-VN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "coupons" && (
        <CouponManager coupons={coupons} onRefresh={fetchCoupons} />
      )}
    </div>
  );
};

export default AdminDashboardPage;
