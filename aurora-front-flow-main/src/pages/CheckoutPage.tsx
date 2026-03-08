import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, MapPin, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/mock-data";
import { toast } from "sonner";

type Step = "shipping" | "payment" | "review";

const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: "shipping", label: "Địa chỉ", icon: <MapPin className="h-4 w-4" /> },
  { key: "payment", label: "Thanh toán", icon: <CreditCard className="h-4 w-4" /> },
  { key: "review", label: "Xác nhận", icon: <CheckCircle2 className="h-4 w-4" /> },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, totalItems } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("shipping");
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount_type: string; discount_value: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: "", phone: "", address: "", ward: "", district: "", city: "", note: "",
  });

  const [payment, setPayment] = useState<"cod" | "card" | "bank">("cod");

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode.toUpperCase().trim())
      .eq("active", true)
      .maybeSingle();

    if (error || !data) {
      toast.error("Mã giảm giá không hợp lệ");
      setCouponApplied(null);
    } else if (data.max_uses && data.used_count >= data.max_uses) {
      toast.error("Mã giảm giá đã hết lượt sử dụng");
    } else if (data.expires_at && new Date(data.expires_at) < new Date()) {
      toast.error("Mã giảm giá đã hết hạn");
    } else if (data.min_order_value && totalPrice < data.min_order_value) {
      toast.error(`Đơn hàng tối thiểu ${formatPrice(data.min_order_value)}`);
    } else {
      setCouponApplied({ code: data.code, discount_type: data.discount_type, discount_value: data.discount_value });
      toast.success(`Đã áp dụng mã "${data.code}"`);
    }
    setCouponLoading(false);
  };

  const discountAmount = couponApplied
    ? couponApplied.discount_type === "percentage"
      ? Math.round(totalPrice * couponApplied.discount_value / 100)
      : couponApplied.discount_value
    : 0;
  const finalPrice = totalPrice - discountAmount;

  if (items.length === 0) {
    return (
      <div className="container-main py-20 text-center">
        <Truck className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Không có sản phẩm để thanh toán</h1>
        <p className="text-muted-foreground mb-6">Hãy thêm sản phẩm vào giỏ hàng trước.</p>
        <Link to="/products"><Button size="lg" className="rounded-xl">Mua sắm ngay</Button></Link>
      </div>
    );
  }

  const stepIndex = steps.findIndex((s) => s.key === step);

  const validateShipping = () => {
    const { fullName, phone, address, district, city } = shipping;
    if (!fullName.trim() || !phone.trim() || !address.trim() || !district.trim() || !city.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
      return false;
    }
    if (!/^[0-9]{9,11}$/.test(phone.replace(/\s/g, ""))) {
      toast.error("Số điện thoại không hợp lệ");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === "shipping" && !validateShipping()) return;
    if (step === "shipping") setStep("payment");
    else if (step === "payment") setStep("review");
  };

  const handleBack = () => {
    if (step === "payment") setStep("shipping");
    else if (step === "review") setStep("payment");
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt hàng");
      navigate("/login");
      return;
    }
    setPlacing(true);
    try {
      const { data: order, error: orderErr } = await supabase.from("orders").insert({
        user_id: user.id,
        total: finalPrice,
        shipping_address: shipping,
        payment_method: payment,
        note: shipping.note || null,
      }).select("id").single();

      if (orderErr) throw orderErr;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price * item.quantity,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      clearCart();
      navigate("/order-confirmation");
    } catch (err: any) {
      toast.error("Đặt hàng thất bại: " + (err.message || "Lỗi không xác định"));
    } finally {
      setPlacing(false);
    }
  };

  const paymentMethods = [
    { value: "cod" as const, label: "Thanh toán khi nhận hàng (COD)", desc: "Trả tiền mặt khi nhận hàng" },
    { value: "card" as const, label: "Thẻ tín dụng / ghi nợ", desc: "Visa, Mastercard, JCB" },
    { value: "bank" as const, label: "Chuyển khoản ngân hàng", desc: "Chuyển khoản qua internet banking" },
  ];

  return (
    <div className="container-main py-8">
      <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Quay lại giỏ hàng
      </Link>

      {!user && (
        <div className="mb-6 rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-warning">
          Bạn cần <Link to="/login" className="font-medium underline">đăng nhập</Link> để đặt hàng và lưu đơn hàng.
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <button onClick={() => i < stepIndex && setStep(s.key)} disabled={i > stepIndex}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                i === stepIndex ? "bg-primary text-primary-foreground" :
                i < stepIndex ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20" : "bg-muted text-muted-foreground"
              }`}>
              {s.icon}<span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && <div className={`h-px w-8 ${i < stepIndex ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === "shipping" && (
              <motion.div key="shipping" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="text-lg font-bold text-card-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Địa chỉ giao hàng
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-card-foreground">Họ và tên <span className="text-destructive">*</span></label>
                    <Input id="fullName" value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} placeholder="Nguyễn Văn A" className="rounded-lg" required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-card-foreground">Số điện thoại <span className="text-destructive">*</span></label>
                    <Input id="phone" type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} placeholder="0901234567" className="rounded-lg" required />
                  </div>
                  <div>
                    <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-card-foreground">Tỉnh / Thành phố <span className="text-destructive">*</span></label>
                    <Input id="city" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} placeholder="TP. Hồ Chí Minh" className="rounded-lg" required />
                  </div>
                  <div>
                    <label htmlFor="district" className="mb-1.5 block text-sm font-medium text-card-foreground">Quận / Huyện <span className="text-destructive">*</span></label>
                    <Input id="district" value={shipping.district} onChange={(e) => setShipping({ ...shipping, district: e.target.value })} placeholder="Quận 1" className="rounded-lg" required />
                  </div>
                  <div>
                    <label htmlFor="ward" className="mb-1.5 block text-sm font-medium text-card-foreground">Phường / Xã</label>
                    <Input id="ward" value={shipping.ward} onChange={(e) => setShipping({ ...shipping, ward: e.target.value })} placeholder="Phường Bến Nghé" className="rounded-lg" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-card-foreground">Địa chỉ cụ thể <span className="text-destructive">*</span></label>
                    <Input id="address" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="Số nhà, tên đường..." className="rounded-lg" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="note" className="mb-1.5 block text-sm font-medium text-card-foreground">Ghi chú</label>
                    <Input id="note" value={shipping.note} onChange={(e) => setShipping({ ...shipping, note: e.target.value })} placeholder="Ghi chú cho shipper..." className="rounded-lg" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleNext} size="lg" className="rounded-xl gap-2">Tiếp tục <CreditCard className="h-4 w-4" /></Button>
                </div>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="text-lg font-bold text-card-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Phương thức thanh toán
                </h2>
                <div className="space-y-3">
                  {paymentMethods.map((m) => (
                    <label key={m.value}
                      className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                        payment === m.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40"
                      }`}>
                      <input type="radio" name="payment" value={m.value} checked={payment === m.value} onChange={() => setPayment(m.value)} className="mt-1 accent-primary" aria-label={m.label} />
                      <div>
                        <span className="text-sm font-medium text-card-foreground">{m.label}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={handleBack} className="rounded-xl">Quay lại</Button>
                  <Button onClick={handleNext} size="lg" className="rounded-xl gap-2">Xem lại đơn hàng <CheckCircle2 className="h-4 w-4" /></Button>
                </div>
              </motion.div>
            )}

            {step === "review" && (
              <motion.div key="review" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-card-foreground flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Giao đến</h3>
                    <button onClick={() => setStep("shipping")} className="text-xs text-primary hover:underline">Sửa</button>
                  </div>
                  <p className="text-sm text-card-foreground font-medium">{shipping.fullName}</p>
                  <p className="text-xs text-muted-foreground">{shipping.phone}</p>
                  <p className="text-xs text-muted-foreground mt-1">{shipping.address}, {shipping.ward && `${shipping.ward}, `}{shipping.district}, {shipping.city}</p>
                  {shipping.note && <p className="text-xs text-muted-foreground mt-1 italic">"{shipping.note}"</p>}
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-card-foreground flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Thanh toán</h3>
                    <button onClick={() => setStep("payment")} className="text-xs text-primary hover:underline">Sửa</button>
                  </div>
                  <p className="text-sm text-card-foreground">{paymentMethods.find((m) => m.value === payment)?.label}</p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <h3 className="text-sm font-bold text-card-foreground mb-3 flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Sản phẩm ({totalItems})</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <img src={item.product.image} alt={item.product.name} className="h-14 w-14 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-card-foreground line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium text-primary whitespace-nowrap">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} className="rounded-xl">Quay lại</Button>
                  <Button onClick={handlePlaceOrder} size="lg" className="rounded-xl gap-2 shadow-glow-red" disabled={placing}>
                    {placing ? "Đang đặt hàng..." : "Đặt hàng"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-bold text-card-foreground mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">{item.product.name} x{item.quantity}</span>
                  <span className="text-card-foreground font-medium whitespace-nowrap">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Coupon input */}
            <div className="border-t border-border pt-3 mb-3">
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Mã giảm giá</label>
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Nhập mã..."
                  className="rounded-xl text-sm font-mono uppercase"
                  disabled={!!couponApplied}
                />
                {couponApplied ? (
                  <Button variant="outline" size="sm" className="rounded-xl shrink-0" onClick={() => { setCouponApplied(null); setCouponCode(""); }}>
                    Bỏ
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-xl shrink-0" onClick={applyCoupon} disabled={couponLoading}>
                    {couponLoading ? "..." : "Áp dụng"}
                  </Button>
                )}
              </div>
              {couponApplied && (
                <p className="text-xs text-success mt-1">
                  ✓ Giảm {couponApplied.discount_type === "percentage" ? `${couponApplied.discount_value}%` : formatPrice(couponApplied.discount_value)}
                </p>
              )}
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="text-card-foreground font-medium">{formatPrice(totalPrice)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Giảm giá</span>
                  <span className="text-success font-medium">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vận chuyển</span>
                <span className="text-success font-medium">Miễn phí</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-base font-semibold text-card-foreground">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">{formatPrice(finalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
