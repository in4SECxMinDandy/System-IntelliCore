import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Tin nhắn đã được gửi! Chúng tôi sẽ phản hồi sớm nhất có thể.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSending(false);
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "support@stitch.vn", href: "mailto:support@stitch.vn" },
    { icon: Phone, label: "Hotline", value: "1900 1234 56", href: "tel:19001234" },
    { icon: MapPin, label: "Địa chỉ", value: "123 Nguyễn Huệ, Q.1, TP.HCM" },
    { icon: Clock, label: "Giờ làm việc", value: "T2 - T7: 8:00 - 18:00" },
  ];

  return (
    <div className="container-main py-8 md:py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Liên hệ</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 max-w-4xl mx-auto">
        {/* Contact Info */}
        <div className="md:col-span-2 space-y-4">
          {contactInfo.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4 p-6 rounded-2xl border border-border bg-card">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Họ tên *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Chủ đề</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Vấn đề cần hỗ trợ"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Nội dung *</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Mô tả chi tiết vấn đề của bạn..."
            />
          </div>
          <Button type="submit" disabled={sending} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            {sending ? "Đang gửi..." : "Gửi tin nhắn"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
