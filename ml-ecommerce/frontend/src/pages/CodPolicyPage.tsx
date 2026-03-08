import { Banknote, Truck, ShieldCheck, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CodPolicyPage = () => {
  return (
    <div className="container-main py-8 md:py-12 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Chính sách thanh toán COD</h1>
        <p className="text-muted-foreground">Thanh toán khi nhận hàng — an toàn và tiện lợi</p>
      </div>

      {/* Highlights */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Banknote, label: "Thanh toán tiền mặt", desc: "Trả tiền khi nhận hàng tận tay" },
          { icon: ShieldCheck, label: "Kiểm tra trước", desc: "Được kiểm tra hàng trước khi thanh toán" },
          { icon: Truck, label: "Giao toàn quốc", desc: "Hỗ trợ COD trên toàn quốc" },
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
        {/* COD là gì */}
        <section className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-xl font-bold text-foreground mb-3">COD là gì?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            COD (Cash On Delivery) là hình thức thanh toán khi nhận hàng. Bạn chỉ cần thanh toán bằng tiền mặt cho nhân viên giao hàng sau khi đã kiểm tra và hài lòng với sản phẩm. Đây là phương thức thanh toán an toàn, phù hợp cho khách hàng muốn xác nhận chất lượng sản phẩm trước khi trả tiền.
          </p>
        </section>

        {/* Điều kiện áp dụng */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" /> Điều kiện áp dụng COD
          </h2>
          <ul className="space-y-2.5">
            {[
              "Đơn hàng có giá trị từ 50.000đ đến 10.000.000đ",
              "Địa chỉ giao hàng nằm trong vùng phục vụ của đơn vị vận chuyển",
              "Mỗi khách hàng tối đa 3 đơn COD đồng thời chưa thanh toán",
              "Sản phẩm không thuộc danh mục hạn chế COD (hàng dễ vỡ giá trị cao, hàng đặt riêng)",
              "Khách hàng cung cấp số điện thoại liên lạc chính xác",
            ].map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                {text}
              </li>
            ))}
          </ul>
        </section>

        {/* Không áp dụng */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" /> Trường hợp không hỗ trợ COD
          </h2>
          <ul className="space-y-2.5">
            {[
              "Đơn hàng vượt quá 10.000.000đ — vui lòng sử dụng chuyển khoản hoặc thẻ",
              "Khu vực vùng sâu, vùng xa chưa có đơn vị vận chuyển hỗ trợ COD",
              "Khách hàng có lịch sử từ chối nhận hàng COD nhiều lần",
              "Sản phẩm đặt hàng riêng (made-to-order) yêu cầu thanh toán trước",
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
            <Truck className="h-5 w-5 text-primary" /> Quy trình thanh toán COD
          </h2>
          <div className="space-y-4">
            {[
              { step: 1, title: "Đặt hàng", desc: "Chọn sản phẩm, thêm vào giỏ hàng và chọn phương thức thanh toán \"Thanh toán khi nhận hàng (COD)\" tại bước checkout." },
              { step: 2, title: "Xác nhận đơn hàng", desc: "Hệ thống sẽ gửi thông báo xác nhận đơn hàng qua email và SMS. Nhân viên có thể gọi điện xác nhận với đơn hàng giá trị lớn." },
              { step: 3, title: "Giao hàng", desc: "Đơn vị vận chuyển sẽ liên hệ trước khi giao. Bạn có thể theo dõi trạng thái đơn hàng trong mục \"Đơn hàng\"." },
              { step: 4, title: "Kiểm tra hàng", desc: "Khi nhận hàng, bạn được quyền kiểm tra bên ngoài kiện hàng. Nếu phát hiện sai sót, bạn có thể từ chối nhận hàng." },
              { step: 5, title: "Thanh toán", desc: "Sau khi kiểm tra và hài lòng, thanh toán tiền mặt cho nhân viên giao hàng. Giữ lại biên nhận giao hàng làm bằng chứng." },
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

        {/* Phí COD */}
        <section className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-xl font-bold text-foreground mb-3">Phí dịch vụ COD</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span>Đơn hàng dưới 500.000đ</span>
              <span className="font-semibold text-foreground">20.000đ</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span>Đơn hàng từ 500.000đ – 2.000.000đ</span>
              <span className="font-semibold text-foreground">10.000đ</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>Đơn hàng trên 2.000.000đ</span>
              <span className="font-semibold text-primary">Miễn phí</span>
            </div>
          </div>
        </section>

        {/* Lưu ý */}
        <section className="p-5 rounded-xl border border-border bg-card">
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" /> Lưu ý quan trọng
          </h2>
          <ul className="space-y-2">
            {[
              "Vui lòng chuẩn bị đúng số tiền cần thanh toán, nhân viên giao hàng có thể không có tiền thối lớn",
              "Không mở kiện hàng trước khi thanh toán trừ khi được nhân viên giao hàng đồng ý",
              "Nếu bạn không có mặt tại địa chỉ giao hàng, đơn vị vận chuyển sẽ giao lại tối đa 2 lần",
              "Sau 3 lần từ chối nhận hàng COD liên tiếp, tài khoản có thể bị hạn chế sử dụng COD",
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
          <p className="text-sm text-muted-foreground mb-3">Có thắc mắc về thanh toán COD?</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CodPolicyPage;
