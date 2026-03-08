import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Package, CreditCard, RotateCcw, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { icon: Package, label: "Đơn hàng", id: "orders" },
  { icon: Truck, label: "Vận chuyển", id: "shipping" },
  { icon: CreditCard, label: "Thanh toán", id: "payment" },
  { icon: RotateCcw, label: "Đổi trả", id: "returns" },
  { icon: ShieldCheck, label: "Tài khoản", id: "account" },
];

const faqs: { category: string; question: string; answer: string }[] = [
  { category: "orders", question: "Làm thế nào để theo dõi đơn hàng?", answer: "Bạn có thể theo dõi đơn hàng bằng cách vào mục \"Đơn hàng\" trong tài khoản. Trạng thái đơn hàng sẽ được cập nhật theo thời gian thực và bạn sẽ nhận thông báo khi có thay đổi." },
  { category: "orders", question: "Tôi có thể hủy đơn hàng không?", answer: "Bạn có thể hủy đơn hàng khi đơn hàng còn ở trạng thái \"Chờ xử lý\". Sau khi đơn hàng đã được xác nhận hoặc đang giao, vui lòng liên hệ bộ phận hỗ trợ để được hỗ trợ." },
  { category: "shipping", question: "Thời gian giao hàng là bao lâu?", answer: "Thời gian giao hàng thông thường từ 2-5 ngày làm việc tùy thuộc vào khu vực. Đối với các đơn hàng nội thành, thời gian giao hàng có thể chỉ 1-2 ngày." },
  { category: "shipping", question: "Phí vận chuyển được tính như thế nào?", answer: "Phí vận chuyển được tính dựa trên khoảng cách và trọng lượng đơn hàng. Đơn hàng từ 500.000đ trở lên được miễn phí vận chuyển." },
  { category: "payment", question: "Các phương thức thanh toán được hỗ trợ?", answer: "Chúng tôi hỗ trợ thanh toán qua Visa/Mastercard, Momo, chuyển khoản ngân hàng và thanh toán khi nhận hàng (COD)." },
  { category: "payment", question: "Thanh toán có an toàn không?", answer: "Tất cả giao dịch thanh toán đều được mã hóa SSL 256-bit. Chúng tôi không lưu trữ thông tin thẻ tín dụng của bạn." },
  { category: "returns", question: "Chính sách đổi trả như thế nào?", answer: "Bạn có thể đổi trả sản phẩm trong vòng 30 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên tem, nhãn và chưa qua sử dụng. Phí đổi trả miễn phí cho các lỗi từ nhà sản xuất." },
  { category: "returns", question: "Hoàn tiền mất bao lâu?", answer: "Sau khi yêu cầu đổi trả được xác nhận, tiền sẽ được hoàn lại trong 5-7 ngày làm việc tùy theo phương thức thanh toán ban đầu." },
  { category: "account", question: "Làm sao để thay đổi mật khẩu?", answer: "Vào mục \"Hồ sơ\" trong tài khoản, chọn \"Đổi mật khẩu\" và làm theo hướng dẫn. Bạn cũng có thể sử dụng tính năng \"Quên mật khẩu\" ở trang đăng nhập." },
  { category: "account", question: "Làm sao để cập nhật thông tin cá nhân?", answer: "Đăng nhập và vào trang \"Hồ sơ\" để cập nhật tên, số điện thoại, địa chỉ và avatar của bạn." },
];

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter((faq) => {
    const matchCategory = !activeCategory || faq.category === activeCategory;
    const matchSearch = !searchQuery || faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="container-main py-8 md:py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Trung tâm trợ giúp</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">Tìm câu trả lời nhanh chóng cho các câu hỏi thường gặp</p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mx-auto mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm câu hỏi..."
          className="w-full rounded-xl border border-input bg-card py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(isActive ? null : cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                isActive ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/20"
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* FAQs */}
      <div className="max-w-2xl mx-auto space-y-3">
        {filteredFaqs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Không tìm thấy kết quả phù hợp</p>
        ) : (
          filteredFaqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                {faq.question}
                {openFaq === i ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* CTA */}
      <div className="text-center mt-12 p-8 rounded-2xl border border-border bg-card">
        <MessageCircle className="h-10 w-10 text-primary mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-foreground mb-2">Vẫn cần hỗ trợ?</h2>
        <p className="text-sm text-muted-foreground mb-4">Đội ngũ hỗ trợ sẵn sàng giúp đỡ bạn</p>
        <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          Liên hệ ngay
        </Link>
      </div>
    </div>
  );
};

export default HelpCenterPage;
