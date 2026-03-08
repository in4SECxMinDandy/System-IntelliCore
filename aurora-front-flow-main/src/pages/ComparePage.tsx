import { Link } from "react-router-dom";
import { ArrowLeft, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/hooks/use-compare";
import { formatPrice, getDiscountPercent } from "@/lib/mock-data";

const ComparePage = () => {
  const { items, removeFromCompare, clearCompare } = useCompare();

  if (items.length < 2) {
    return (
      <div className="container-main py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">So sánh sản phẩm</h1>
        <p className="text-muted-foreground mb-6">Chọn ít nhất 2 sản phẩm để so sánh.</p>
        <Link to="/products"><Button className="rounded-xl">Chọn sản phẩm</Button></Link>
      </div>
    );
  }

  const rows: { label: string; render: (p: typeof items[0]) => React.ReactNode }[] = [
    {
      label: "Ảnh",
      render: (p) => <img src={p.image} alt={p.name} className="h-32 w-32 mx-auto rounded-xl object-cover" />,
    },
    {
      label: "Tên sản phẩm",
      render: (p) => (
        <Link to={`/products/${p.slug}`} className="text-sm font-medium text-primary hover:underline">
          {p.name}
        </Link>
      ),
    },
    {
      label: "Giá",
      render: (p) => (
        <div>
          <span className="text-lg font-bold text-primary">{formatPrice(p.price)}</span>
          {p.originalPrice && (
            <span className="block text-xs text-muted-foreground line-through">{formatPrice(p.originalPrice)}</span>
          )}
        </div>
      ),
    },
    {
      label: "Giảm giá",
      render: (p) => {
        const d = getDiscountPercent(p.price, p.originalPrice);
        return d ? <span className="text-sm font-medium text-primary">-{d}%</span> : <span className="text-muted-foreground">—</span>;
      },
    },
    {
      label: "Danh mục",
      render: (p) => <span className="text-sm text-card-foreground">{p.category}</span>,
    },
    {
      label: "Đánh giá",
      render: (p) => (
        <div className="flex items-center justify-center gap-1">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="text-sm font-medium">{p.rating}</span>
          <span className="text-xs text-muted-foreground">({p.reviewCount})</span>
        </div>
      ),
    },
    {
      label: "Tình trạng",
      render: (p) => (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${p.inStock ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
          {p.inStock ? "Còn hàng" : "Hết hàng"}
        </span>
      ),
    },
    {
      label: "Mô tả",
      render: (p) => <p className="text-xs text-muted-foreground line-clamp-3">{p.description || "—"}</p>,
    },
  ];

  return (
    <div className="container-main py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-2">
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Link>
          <h1 className="text-2xl font-bold text-foreground">So sánh sản phẩm</h1>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl" onClick={clearCompare}>Xóa tất cả</Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-32">Thông số</th>
              {items.map((p) => (
                <th key={p.id} className="px-4 py-3 text-center min-w-[200px]">
                  <button onClick={() => removeFromCompare(p.id)} className="text-muted-foreground hover:text-destructive float-right">
                    <X className="h-4 w-4" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-xs font-medium text-muted-foreground align-middle">{row.label}</td>
                {items.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center align-middle">{row.render(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
