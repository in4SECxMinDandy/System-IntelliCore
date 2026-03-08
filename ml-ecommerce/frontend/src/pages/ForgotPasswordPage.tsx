import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error("Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.");
    } else {
      setSent(true);
    }
  };

  return (
    <div className="container-main flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-panel">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-card-foreground mb-2">Kiểm tra email</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Chúng tôi đã gửi liên kết đặt lại mật khẩu đến <span className="font-medium text-foreground">{email}</span>. Vui lòng kiểm tra hộp thư của bạn.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full rounded-xl">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại đăng nhập
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <span className="text-xl font-bold text-primary-foreground">S</span>
                </div>
                <h1 className="text-2xl font-bold text-card-foreground">Quên mật khẩu</h1>
                <p className="mt-1 text-sm text-muted-foreground">Nhập email để nhận liên kết đặt lại mật khẩu</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-card-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required
                      className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full rounded-xl" disabled={loading}>
                  {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link to="/login" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                  <ArrowLeft className="h-3.5 w-3.5" /> Quay lại đăng nhập
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
