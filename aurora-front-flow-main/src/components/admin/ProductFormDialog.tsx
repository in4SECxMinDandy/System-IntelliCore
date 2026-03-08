import { useState, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductForm {
  id?: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  original_price: number | null;
  description: string;
  image: string;
  badge: string;
  in_stock: boolean;
}

const emptyForm: ProductForm = {
  name: "", slug: "", category: "", price: 0, original_price: null,
  description: "", image: "", badge: "", in_stock: true,
};

interface Props {
  product?: ProductForm | null;
  onClose: () => void;
  onSaved: () => void;
}

const ProductFormDialog = ({ product, onClose, onSaved }: Props) => {
  const [form, setForm] = useState<ProductForm>(product || emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      toast.error("Lỗi upload ảnh");
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image: data.publicUrl }));
    setUploading(false);
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

  const handleSave = async () => {
    if (!form.name || !form.category || !form.price) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setSaving(true);
    const slug = form.slug || generateSlug(form.name);
    const payload = {
      name: form.name,
      slug,
      category: form.category,
      price: form.price,
      original_price: form.original_price || null,
      description: form.description || null,
      image: form.image || "/placeholder.svg",
      badge: form.badge || null,
      in_stock: form.in_stock,
    };

    let error;
    if (form.id) {
      ({ error } = await supabase.from("products").update(payload).eq("id", form.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }

    if (error) {
      toast.error("Lỗi lưu sản phẩm: " + error.message);
    } else {
      toast.success(form.id ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm");
      onSaved();
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-card-foreground">{form.id ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Image */}
          <div>
            <label className="text-sm font-medium text-card-foreground block mb-1">Ảnh sản phẩm</label>
            <div className="flex items-center gap-3">
              {form.image && <img src={form.image} alt="" className="h-16 w-16 rounded-xl object-cover border border-border" />}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-xl">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
                {uploading ? "Đang tải..." : "Upload ảnh"}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-card-foreground block mb-1">Tên sản phẩm *</label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: generateSlug(e.target.value) }))} className="rounded-xl" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-card-foreground block mb-1">Danh mục *</label>
              <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="rounded-xl" placeholder="Điện thoại" />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground block mb-1">Badge</label>
              <Input value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} className="rounded-xl" placeholder="Mới, Hot..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-card-foreground block mb-1">Giá (VNĐ) *</label>
              <Input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: +e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground block mb-1">Giá gốc</label>
              <Input type="number" value={form.original_price || ""} onChange={(e) => setForm((f) => ({ ...f, original_price: e.target.value ? +e.target.value : null }))} className="rounded-xl" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-card-foreground block mb-1">Slug</label>
            <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="rounded-xl text-xs text-muted-foreground" />
          </div>

          <div>
            <label className="text-sm font-medium text-card-foreground block mb-1">Mô tả</label>
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="rounded-xl" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm((f) => ({ ...f, in_stock: e.target.checked }))} className="rounded" />
            <span className="text-sm text-card-foreground">Còn hàng</span>
          </label>
        </div>

        <div className="flex gap-2 p-5 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Hủy</Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1 rounded-xl">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
            {form.id ? "Cập nhật" : "Thêm"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormDialog;
