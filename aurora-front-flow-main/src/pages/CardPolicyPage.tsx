import { CreditCard, ShieldCheck, Lock, Globe, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const CardPolicyPage = () => {
  return (
    <div className="container-main py-8 md:py-12 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Chính sách thanh toán Visa / Mastercard</h1>
        <p className="text-muted-foreground">Thanh toán nhanh chóng, bảo mật với thẻ quốc tế</p>
      </div>

      {/* Highlights */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Lock, label: "Mã hóa SSL 256-bit", desc: "Bảo mật giao dịch tuyệt đối" },
          { icon: Globe, label: "Thẻ quốc tế", desc: "Visa, Mastercard, JCB, Amex" },
          { icon: ShieldCheck, label: "3D Secure", desc: "Xác thực 2 lớp an toàn" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="p-5 rounded-xl border border-border bg-card text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-8">
        <section className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-xl font-bold text-foreground mb-3">Giới thiệu</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Stitch IntelliCore hỗ trợ thanh toán qua các loại thẻ tín dụng và thẻ ghi nợ quốc tế bao gồm Visa, Mastercard, JCB và American Express. Mọi giao dịch đều được xử lý qua cổng thanh toán đạt chuẩn PCI DSS, đảm bảo thông tin thẻ của bạn luôn được bảo vệ an toàn tuyệt đối.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" /> Loại thẻ được hỗ trợ
          </h2>
          <ul className="space-y-2.5">
            {[
              "Thẻ tín dụng Visa, Mastercard, JCB, American Express",
              "Thẻ ghi nợ (debit) quốc tế có chức năng thanh toán online",
              "Thẻ trả trước (prepaid) Visa/Mastercard có số dư đủ",
              "Thẻ phát hành bởi ngân hàng trong nước và quốc tế",
            ].map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                {text}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" /> Quy trình thanh toán
          </h2>
          <div className="space-y-4">
            {[
              { step: 1, title: "Chọn phương thức", desc: "Tại trang thanh toán, chọn \"Visa / Mastercard\" làm phương thức thanh toán." },
              { step: 2, title: "Nhập thông tin thẻ", desc: "Điền số thẻ, tên chủ thẻ, ngày hết hạn và mã CVV/CVC. Thông tin được mã hóa ngay lập tức." },
              { step: 3, title: "Xác thực 3D Secure", desc: "Ngân hàng sẽ gửi mã OTP qua SMS hoặc ứng dụng để xác nhận giao dịch (tùy ngân hàng)." },
              { step: 4, title: "Hoàn tất", desc: "Sau khi xác thực thành công, đơn hàng được xác nhận ngay lập tức. Bạn nhận email xác nhận trong vài giây." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" /> Trường hợp giao dịch thất bại
          </h2>
          <ul className="space-y-2.5">
            {[
              "Thẻ hết hạn hoặc bị khóa chức năng thanh toán online",
              "Số dư/hạn mức thẻ không đủ cho giá trị đơn hàng",
              "Nhập sai thông tin thẻ hoặc mã OTP quá số lần cho phép",
              "Ngân hàng phát hành từ chối giao dịch vì lý do bảo mật",
            ].map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                {text}
              </li>
            ))}
          </ul>
        </section>

        <section className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-xl font-bold text-foreground mb-3">Chính sách hoàn tiền</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span>Hủy đơn trước khi xử lý</span>
              <span className="font-semibold text-foreground">Hoàn 100% trong 1-3 ngày</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span>Đổi trả theo chính sách</span>
              <span className="font-semibold text-foreground">Hoàn trong 5-7 ngày</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>Giao dịch lỗi / trừ tiền sai</span>
              <span className="font-semibold text-primary">Hoàn trong 7-14 ngày</span>
            </div>
          </div>
        </section>

        <section className="p-5 rounded-xl border border-border bg-card">
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" /> Lưu ý bảo mật
          </h2>
          <ul className="space-y-2">
            {[
              "Stitch IntelliCore không lưu trữ thông tin thẻ tín dụng của bạn",
              "Không chia sẻ mã OTP hoặc thông tin thẻ cho bất kỳ ai, kể cả nhân viên hỗ trợ",
              "Luôn kiểm tra URL trang thanh toán bắt đầu bằng https:// trước khi nhập thông tin",
              "Liên hệ ngay ngân hàng nếu phát hiện giao dịch bất thường",
            ].map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="text-yellow-500 shrink-0">•</span>
                {text}
              </li>
            ))}
          </ul>
        </section>

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground mb-3">Cần hỗ trợ về thanh toán thẻ?</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardPolicyPage;
