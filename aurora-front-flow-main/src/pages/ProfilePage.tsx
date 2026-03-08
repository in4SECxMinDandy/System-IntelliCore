import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Camera, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileData {
  full_name: string;
  phone: string;
  avatar_url: string;
  default_address: {
    fullName: string;
    phone: string;
    address: string;
    district: string;
    city: string;
  };
}

const emptyAddress = { fullName: "", phone: "", address: "", district: "", city: "" };

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "", phone: "", avatar_url: "", default_address: emptyAddress,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const addr = (data.default_address as any) || emptyAddress;
          setProfile({
            full_name: data.full_name || "",
            phone: data.phone || "",
            avatar_url: data.avatar_url || "",
            default_address: { ...emptyAddress, ...addr },
          });
        }
        setLoading(false);
      });
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      toast.error("Lỗi upload ảnh");
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setProfile((p) => ({ ...p, avatar_url: data.publicUrl + "?t=" + Date.now() }));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        default_address: profile.default_address as any,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Lỗi cập nhật hồ sơ");
    } else {
      toast.success("Đã lưu hồ sơ");
    }
    setSaving(false);
  };

  if (authLoading || loading) {
    return <div className="container-main py-20 text-center text-muted-foreground">Đang tải...</div>;
  }

  if (!user) return null;

  const addr = profile.default_address;

  return (
    <div className="container-main py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-foreground mb-2">Hồ sơ cá nhân</h1>
      <p className="text-muted-foreground mb-8">Quản lý thông tin tài khoản của bạn</p>

      <div className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="h-20 w-20 rounded-full bg-muted border-2 border-border overflow-hidden flex items-center justify-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              {uploading ? <Loader2 className="h-5 w-5 text-white animate-spin" /> : <Camera className="h-5 w-5 text-white" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
          <div>
            <p className="text-sm font-medium text-card-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">Nhấn vào ảnh để thay đổi</p>
          </div>
        </div>

        {/* Basic info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-card-foreground">Thông tin cơ bản</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Họ và tên</label>
              <Input value={profile.full_name} onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Số điện thoại</label>
              <Input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className="rounded-xl" placeholder="0912 345 678" />
            </div>
          </div>
        </div>

        {/* Default address */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-card-foreground">Địa chỉ mặc định</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Tên người nhận</label>
              <Input value={addr.fullName} onChange={(e) => setProfile((p) => ({ ...p, default_address: { ...p.default_address, fullName: e.target.value } }))} className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">SĐT người nhận</label>
              <Input value={addr.phone} onChange={(e) => setProfile((p) => ({ ...p, default_address: { ...p.default_address, phone: e.target.value } }))} className="rounded-xl" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Địa chỉ</label>
            <Input value={addr.address} onChange={(e) => setProfile((p) => ({ ...p, default_address: { ...p.default_address, address: e.target.value } }))} className="rounded-xl" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Quận/Huyện</label>
              <Input value={addr.district} onChange={(e) => setProfile((p) => ({ ...p, default_address: { ...p.default_address, district: e.target.value } }))} className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Thành phố</label>
              <Input value={addr.city} onChange={(e) => setProfile((p) => ({ ...p, default_address: { ...p.default_address, city: e.target.value } }))} className="rounded-xl" />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full rounded-xl" size="lg">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
