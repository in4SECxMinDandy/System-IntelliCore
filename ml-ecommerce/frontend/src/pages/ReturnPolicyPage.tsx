import { Package, RotateCcw, Clock, CheckCircle, XCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ReturnPolicyPage = () => {
  return (
    <div className="container-main py-8 md:py-12 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Chính sách đổi trả</h1>
        <p className="text-muted-foreground">Cam kết đảm bảo quyền lợi khách hàng</p>
      </div>

      {/* Highlights */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Clock, label: "30 ngày đổi trả", desc: "Kể từ ngày nhận hàng" },
          { icon: RotateCcw, label: "Miễn phí đổi trả", desc: "Với lỗi từ nhà sản xuất" },
          { icon: Package, label: "Hoàn tiền nhanh", desc: "Trong 5-7 ngày làm việc" },
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
        {/* Điều kiện đổi trả */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" /> Điều kiện được đổi trả
          </h2>
          <ul className="space-y-2.5">
            {[
              "Sản phẩm còn nguyên tem, nhãn mác và bao bì gốc",
              "Sản phẩm chưa qua sử dụng, giặt ủi hoặc chỉnh sửa",
              "Sản phẩm bị lỗi kỹ thuật từ nhà sản xuất (rách, bung chỉ, sai màu...)",
              "Sản phẩm giao sai mẫu, sai kích cỡ so với đơn đặt hàng",
              "Có hóa đơn hoặc xác nhận đơn hàng từ hệ thống",
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
            <XCircle className="h-5 w-5 text-destructive" /> Trường hợp không áp dụng
          </h2>
          <ul className="space-y-2.5">
            {[
              "Sản phẩm đã qua sử dụng, có dấu hiệu giặt ủi, mặc thử nhiều lần",
              "Sản phẩm thuộc chương trình khuyến mãi đặc biệt (trừ hàng lỗi)",
              "Quá thời hạn 30 ngày kể từ ngày nhận hàng",
              "Sản phẩm bị hư hỏng do lỗi của người sử dụng",
              "Không có hóa đơn hoặc thông tin đơn hàng",
            ].map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                {text}
              </li>
            ))}
          </ul>
        </section>

        {/* Quy trình */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" /> Quy trình đổi trả
          </h2>
          <div className="space-y-4">
            {[
              { step: 1, title: "Gửi yêu cầu", desc: "Liên hệ bộ phận hỗ trợ qua trang Liên hệ hoặc hotline 1900 1234 56. Cung cấp mã đơn hàng, lý do đổi trả và hình ảnh sản phẩm (nếu có)." },
              { step: 2, title: "Xác nhận yêu cầu", desc: "Đội ngũ hỗ trợ sẽ xem xét và phản hồi trong vòng 24 giờ làm việc. Nếu yêu cầu hợp lệ, bạn sẽ nhận hướng dẫn gửi trả hàng." },
              { step: 3, title: "Gửi trả sản phẩm", desc: "Đóng gói sản phẩm cẩn thận và gửi về địa chỉ kho hàng theo hướng dẫn. Phí vận chuyển đổi trả được miễn phí với lỗi từ nhà sản xuất." },
              { step: 4, title: "Kiểm tra & xử lý", desc: "Sau khi nhận được sản phẩm, chúng tôi sẽ kiểm tra trong 1-2 ngày làm việc và tiến hành đổi sản phẩm mới hoặc hoàn tiền." },
              { step: 5, title: "Hoàn tất", desc: "Sản phẩm thay thế sẽ được gửi trong 2-3 ngày. Hoàn tiền sẽ được xử lý trong 5-7 ngày làm việc về phương thức thanh toán ban đầu." },
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

        {/* Lưu ý */}
        <section className="p-5 rounded-xl border border-border bg-card">
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" /> Lưu ý quan trọng
          </h2>
          <ul className="space-y-2">
            {[
              "Mỗi đơn hàng chỉ được yêu cầu đổi trả 1 lần",
              "Sản phẩm đổi trả phải có giá trị tương đương. Nếu chênh lệch giá, khách hàng thanh toán hoặc được hoàn phần chênh lệch",
              "Đối với sản phẩm giảm giá, hoàn tiền sẽ theo giá thực trả, không phải giá gốc",
            ].map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="text-yellow-500 shrink-0">•</span>
                {text}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground mb-3">Bạn cần hỗ trợ đổi trả?</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
