import { Link } from "react-router-dom";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const OrderConfirmationPage = () => {
  const orderNumber = `STI-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="container-main flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-panel">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--success))]/10"
          >
            <CheckCircle2 className="h-10 w-10 text-[hsl(var(--success))]" />
          </motion.div>

          <h1 className="text-2xl font-bold text-card-foreground mb-2">Đặt hàng thành công!</h1>
          <p className="text-muted-foreground mb-1">Cảm ơn bạn đã mua sắm tại Stitch</p>
          <p className="text-sm text-muted-foreground mb-6">
            Mã đơn hàng: <span className="font-mono font-bold text-primary">{orderNumber}</span>
          </p>

          <div className="rounded-xl bg-muted p-4 mb-6 text-left text-sm text-muted-foreground space-y-1">
            <p>📦 Đơn hàng đang được xử lý</p>
            <p>📧 Email xác nhận sẽ được gửi sớm</p>
            <p>🚚 Dự kiến giao trong 2-5 ngày</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link to="/products">
              <Button size="lg" className="w-full rounded-xl gap-2">
                <ShoppingBag className="h-4 w-4" /> Tiếp tục mua sắm
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full rounded-xl gap-2">
                Về trang chủ <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmationPage;
