import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/lib/mock-data";

const HomePage = () => {
  const featuredProducts = products.slice(0, 4);
  const trendingProducts = products.slice(4, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-90" />
        <div className="container-main relative py-16 sm:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-background/10 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-background/90">AI-Powered Shopping</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-background leading-[1.1] mb-6">
              Mua sắm thông minh với{" "}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                IntelliCore
              </span>
            </h1>
            <p className="text-lg text-background/70 mb-8 leading-relaxed max-w-lg">
              Nền tảng thương mại điện tử với gợi ý sản phẩm cá nhân hóa bằng Machine Learning.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button variant="hero" size="lg" className="gap-2 rounded-xl px-8">
                  Khám phá ngay <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/deals">
                <Button variant="hero-outline" size="lg" className="gap-2 rounded-xl px-8 border-background/30 text-background hover:bg-background/10 hover:text-background">
                  Ưu đãi hôm nay
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-main py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Danh mục</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/products?category=${cat.name}`}
                className="flex flex-col items-center gap-2 rounded-2xl bg-card border border-border p-4 hover:shadow-card-hover hover:border-primary/30 transition-all"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-card-foreground text-center leading-tight">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container-main py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Sản phẩm nổi bật</h2>
          </div>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* AI Banner */}
      <section className="container-main py-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent p-8 sm:p-12">
          <div className="relative z-10 max-w-lg">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-background/20 px-3 py-1">
              <Zap className="h-4 w-4 text-background" />
              <span className="text-xs font-semibold text-background">AI Recommendation</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-background mb-3">
              Gợi ý dành riêng cho bạn
            </h3>
            <p className="text-background/80 text-sm mb-6">
              Hệ thống ML phân tích hành vi mua sắm và đưa ra gợi ý sản phẩm phù hợp nhất.
            </p>
            <Link to="/products">
              <Button variant="secondary" size="lg" className="rounded-xl font-semibold">
                Xem gợi ý AI
              </Button>
            </Link>
          </div>
          <div className="absolute -right-8 -bottom-8 h-48 w-48 rounded-full bg-background/10" />
          <div className="absolute right-16 -top-12 h-32 w-32 rounded-full bg-background/5" />
        </div>
      </section>

      {/* Trending */}
      <section className="container-main py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Xu hướng</h2>
          </div>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {trendingProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
