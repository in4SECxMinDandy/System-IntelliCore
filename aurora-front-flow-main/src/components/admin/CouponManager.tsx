import { useState } from "react";
import { X, Plus, Loader2, Pencil, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatPrice } from "@/lib/mock-data";

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  expires_at: string | null;
}

interface Props {
  coupons: Coupon[];
  onRefresh: () => void;
}

const emptyForm = {
  code: "",
  discount_type: "percentage" as string,
  discount_value: 0,
  min_order_value: 0,
  max_uses: null as number | null,
  active: true,
  expires_at: "",
};

const CouponManager = ({ coupons, onRefresh }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openEdit = (c: Coupon) => {
    setEditId(c.id);
    setForm({
      code: c.code,
      discount_type: c.discount_type,
      discount_value: c.discount_value,
      min_order_value: c.min_order_value,
      max_uses: c.max_uses,
      active: c.active,
      expires_at: c.expires_at ? c.expires_at.split("T")[0] : "",
    });
    setShowForm(true);
  };

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.discount_value) {
      toast.error("Vui lòng điền mã và giá trị giảm");
      return;
    }
    setSaving(true);
    const payload = {
      code: form.code.toUpperCase().trim(),
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      min_order_value: form.min_order_value || 0,
      max_uses: form.max_uses || null,
      active: form.active,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from("coupons").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("coupons").insert(payload));
    }

    if (error) toast.error("Lỗi: " + error.message);
    else {
      toast.success(editId ? "Đã cập nhật" : "Đã tạo mã giảm giá");
      setShowForm(false);
      onRefresh();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-card-foreground flex items-center gap-2">
          <Tag className="h-4 w-4" /> Mã giảm giá ({coupons.length})
        </h3>
        <Button size="sm" className="rounded-xl" onClick={openNew}>
          <Plus className="h-4 w-4 mr-1" /> Tạo mã
        </Button>
      </div>

      {/* Coupon list */}
      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Mã</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Giảm</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Đơn tối thiểu</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Đã dùng</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Trạng thái</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Chưa có mã giảm giá</td></tr>
              ) : coupons.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-card-foreground">{c.code}</td>
                  <td className="px-4 py-3 text-primary font-medium">
                    {c.discount_type === "percentage" ? `${c.discount_value}%` : formatPrice(c.discount_value)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.min_order_value ? formatPrice(c.min_order_value) : "—"}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    {c.used_count}{c.max_uses ? `/${c.max_uses}` : ""}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${c.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {c.active ? "Hoạt động" : "Tắt"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={async () => {
                        if (!confirm("Xóa mã này?")) return;
                        await supabase.from("coupons").delete().eq("id", c.id);
                        toast.success("Đã xóa");
                        onRefresh();
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

      {/* Form dialog */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-card border border-border rounded-2xl shadow-lg w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-card-foreground">{editId ? "Sửa mã giảm giá" : "Tạo mã giảm giá"}</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Mã giảm giá *</label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="rounded-xl font-mono uppercase" placeholder="SALE20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Loại giảm</label>
                  <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Giá trị *</label>
                  <Input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: +e.target.value })} className="rounded-xl"
                    placeholder={form.discount_type === "percentage" ? "20" : "50000"} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Đơn tối thiểu</label>
                  <Input type="number" value={form.min_order_value || ""} onChange={(e) => setForm({ ...form, min_order_value: +e.target.value })} className="rounded-xl" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Giới hạn dùng</label>
                  <Input type="number" value={form.max_uses || ""} onChange={(e) => setForm({ ...form, max_uses: e.target.value ? +e.target.value : null })} className="rounded-xl" placeholder="Không giới hạn" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Hết hạn</label>
                <Input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className="rounded-xl" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded" />
                <span className="text-sm text-card-foreground">Kích hoạt</span>
              </label>
            </div>
            <div className="flex gap-2 mt-5">
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 rounded-xl">Hủy</Button>
              <Button onClick={handleSave} disabled={saving} className="flex-1 rounded-xl">
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                {editId ? "Cập nhật" : "Tạo"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManager;
