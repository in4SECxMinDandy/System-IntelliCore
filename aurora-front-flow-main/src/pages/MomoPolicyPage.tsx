import { Smartphone, Zap, ShieldCheck, QrCode, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const MomoPolicyPage = () => {
  return (
    <div className="container-main py-8 md:py-12 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Chính sách thanh toán Momo</h1>
        <p className="text-muted-foreground">Thanh toán siêu tốc qua ví điện tử Momo</p>
      </div>

      {/* Highlights */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Zap, label: "Thanh toán tức thì", desc: "Xác nhận đơn hàng trong vài giây" },
          { icon: QrCode, label: "Quét QR tiện lợi", desc: "Thanh toán bằng mã QR nhanh chóng" },
          { icon: ShieldCheck, label: "Bảo mật cao", desc: "Xác thực bằng PIN & vân tay" },
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
            Momo là ví điện tử hàng đầu Việt Nam với hơn 30 triệu người dùng. Thanh toán qua Momo tại Stitch IntelliCore giúp bạn hoàn tất giao dịch chỉ trong vài giây, không cần nhập thông tin thẻ, đảm bảo an toàn và tiện lợi tối đa.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" /> Điều kiện sử dụng
          </h2>
          <ul className="space-y-2.5">
            {[
              "Có tài khoản Momo đã xác thực (eKYC hoặc CMND/CCCD)",
              "Ví Momo có số dư đủ hoặc đã liên kết ngân hàng/thẻ",
              "Ứng dụng Momo phiên bản mới nhất trên điện thoại",
              "Đơn hàng có giá trị tối đa 50.000.000đ mỗi giao dịch",
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
            <Smartphone className="h-5 w-5 text-primary" /> Quy trình thanh toán
          </h2>
          <div className="space-y-4">
            {[
              { step: 1, title: "Chọn Momo", desc: "Tại trang thanh toán, chọn \"Ví Momo\" làm phương thức thanh toán." },
              { step: 2, title: "Chuyển hướng đến Momo", desc: "Hệ thống sẽ chuyển bạn đến trang/app Momo. Trên điện thoại, ứng dụng Momo sẽ tự động mở." },
              { step: 3, title: "Xác nhận thanh toán", desc: "Kiểm tra thông tin đơn hàng trên Momo, nhập mã PIN hoặc xác thực vân tay/FaceID để xác nhận." },
              { step: 4, title: "Hoàn tất", desc: "Sau khi thanh toán thành công, bạn được chuyển về trang xác nhận đơn hàng. Thông báo xác nhận gửi qua cả Momo và email." },
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
              "Ví Momo chưa xác thực danh tính hoặc bị tạm khóa",
              "Số dư ví và tài khoản liên kết không đủ",
              "Hết thời gian xác nhận thanh toán (thường 5 phút)",
              "Lỗi kết nối mạng trong quá trình xử lý giao dịch",
            ].map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                {text}
              </li>
            ))}
          </ul>
        </section>

        <section className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-xl font-bold text-foreground mb-3">Ưu đãi khi thanh toán Momo</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span>Đơn hàng đầu tiên qua Momo</span>
              <span className="font-semibold text-primary">Giảm 30.000đ</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span>Đơn hàng từ 1.000.000đ</span>
              <span className="font-semibold text-primary">Hoàn 2% vào ví</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>Phí thanh toán</span>
              <span className="font-semibold text-primary">Miễn phí</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">* Ưu đãi có thể thay đổi theo từng thời điểm</p>
        </section>

        <section className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-xl font-bold text-foreground mb-3">Chính sách hoàn tiền</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span>Hủy đơn trước khi xử lý</span>
              <span className="font-semibold text-foreground">Hoàn về ví Momo trong 24h</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span>Đổi trả theo chính sách</span>
              <span className="font-semibold text-foreground">Hoàn trong 3-5 ngày</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>Giao dịch lỗi / trừ tiền sai</span>
              <span className="font-semibold text-primary">Hoàn trong 1-3 ngày</span>
            </div>
          </div>
        </section>

        <section className="p-5 rounded-xl border border-border bg-card">
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" /> Lưu ý quan trọng
          </h2>
          <ul className="space-y-2">
            {[
              "Không chia sẻ mã PIN Momo cho bất kỳ ai",
              "Chỉ thanh toán qua link/QR chính thức từ Stitch IntelliCore",
              "Kiểm tra kỹ thông tin đơn hàng trên Momo trước khi xác nhận",
              "Liên hệ hotline Momo 1900 5454 41 nếu gặp sự cố với ví",
            ].map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="text-yellow-500 shrink-0">•</span>
                {text}
              </li>
            ))}
          </ul>
        </section>

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground mb-3">Cần hỗ trợ về thanh toán Momo?</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MomoPolicyPage;
