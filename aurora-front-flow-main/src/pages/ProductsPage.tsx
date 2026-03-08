import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid3X3, List, SlidersHorizontal, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";

const sortOptions = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá thấp → cao", value: "price-asc" },
  { label: "Giá cao → thấp", value: "price-desc" },
  { label: "Đánh giá cao nhất", value: "rating" },
  { label: "Bán chạy", value: "popular" },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch products from database
  useEffect(() => {
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const mapped: Product[] = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          originalPrice: p.original_price,
          image: p.image,
          images: p.images,
          category: p.category,
          rating: p.rating || 0,
          reviewCount: p.review_count || 0,
          badge: p.badge,
          inStock: p.in_stock ?? true,
          description: p.description,
        }));
        setProducts(mapped);

        // Extract unique categories
        const cats = [...new Set(mapped.map((p) => p.category))].sort();
        setCategories(cats);
        setLoading(false);
      });
  }, []);

  // Filtered & sorted products
  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break; // newest = default order from DB
    }

    return result;
  }, [products, selectedCategory, minPrice, maxPrice, sortBy]);

  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, minPrice, maxPrice, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeFilterCount = [selectedCategory, minPrice, maxPrice].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSearchParams({});
  };

  return (
    <div className="container-main py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {selectedCategory || "Tất cả sản phẩm"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} sản phẩm
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter toggle (mobile) */}
          <Button
            variant={filtersOpen ? "default" : "outline"}
            size="sm"
            className="rounded-xl lg:hidden"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Bộ lọc
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-primary text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Sắp xếp theo"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Active filter chips */}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
              {selectedCategory}
              <button onClick={() => setSelectedCategory("")}><X className="h-3 w-3" /></button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
              {minPrice ? formatPrice(+minPrice) : "0"} — {maxPrice ? formatPrice(+maxPrice) : "∞"}
              <button onClick={() => { setMinPrice(""); setMaxPrice(""); }}><X className="h-3 w-3" /></button>
            </span>
          )}
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground underline">
              Xóa bộ lọc
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("grid")} aria-label="Xem dạng lưới">
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("list")} aria-label="Xem dạng danh sách">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters - desktop always visible, mobile toggle */}
        <AnimatePresence>
          {(filtersOpen || true) && (
            <motion.aside
              initial={false}
              className={`shrink-0 w-56 space-y-6 ${filtersOpen ? "block" : "hidden lg:block"}`}
            >
              {/* Category filter */}
              <div>
                <h3 className="text-sm font-bold text-card-foreground mb-3">Danh mục</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                      !selectedCategory ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Tất cả ({products.length})
                  </button>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                          selectedCategory === cat ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price range filter */}
              <div>
                <h3 className="text-sm font-bold text-card-foreground mb-3">Khoảng giá</h3>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Từ (VNĐ)"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Đến (VNĐ)"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
                {/* Quick price presets */}
                <div className="mt-2 space-y-1">
                  {[
                    { label: "Dưới 5 triệu", min: "", max: "5000000" },
                    { label: "5 - 15 triệu", min: "5000000", max: "15000000" },
                    { label: "15 - 30 triệu", min: "15000000", max: "30000000" },
                    { label: "Trên 30 triệu", min: "30000000", max: "" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => { setMinPrice(preset.min); setMaxPrice(preset.max); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        minPrice === preset.min && maxPrice === preset.max
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid gap-4 lg:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card animate-pulse h-72" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">Không tìm thấy sản phẩm nào.</p>
              {activeFilterCount > 0 && (
                <Button variant="outline" onClick={clearFilters} className="mt-4 rounded-xl">
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          ) : (
            <div className={`grid gap-4 lg:gap-6 ${
              viewMode === "grid"
                ? "grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2"
            }`}>
              {paginatedProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              >
                Trước
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  className="rounded-xl min-w-[36px]"
                  onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={currentPage === totalPages}
                onClick={() => { setCurrentPage((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              >
                Sau
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
