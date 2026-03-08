import { useState, useEffect } from "react";
import { Star, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profile_name?: string;
}

const ReviewSection = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (data) {
      // Fetch profile names
      const userIds = [...new Set(data.map((r) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);

      const enriched = data.map((r) => ({
        ...r,
        profile_name: profileMap.get(r.user_id) || "Người dùng ẩn danh",
      }));

      setReviews(enriched);
      if (user) {
        setUserReview(enriched.find((r) => r.user_id === user.id) || null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, user]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để viết đánh giá");
      return;
    }
    setSubmitting(true);
    try {
      if (userReview) {
        await supabase
          .from("reviews")
          .update({ rating, comment: comment.trim() || null, updated_at: new Date().toISOString() })
          .eq("id", userReview.id);
        toast.success("Đã cập nhật đánh giá");
      } else {
        await supabase.from("reviews").insert({
          user_id: user.id,
          product_id: productId,
          rating,
          comment: comment.trim() || null,
        });
        toast.success("Đã gửi đánh giá");
      }
      setComment("");
      fetchReviews();
    } catch {
      toast.error("Không thể gửi đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-foreground mb-2">Đánh giá sản phẩm</h2>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i <= Number(avgRating) ? "fill-warning text-warning" : "text-muted"}`}
            />
          ))}
        </div>
        <span className="text-lg font-semibold text-foreground">{avgRating}</span>
        <span className="text-sm text-muted-foreground">({reviews.length} đánh giá)</span>
      </div>

      {/* Write review */}
      {user && (
        <div className="rounded-2xl border border-border bg-card p-5 mb-6">
          <h3 className="text-sm font-bold text-card-foreground mb-3">
            {userReview ? "Cập nhật đánh giá của bạn" : "Viết đánh giá"}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(i)}
                className="p-0.5"
                aria-label={`${i} sao`}
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    i <= (hoverRating || rating)
                      ? "fill-warning text-warning"
                      : "text-muted"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
            className="w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            rows={3}
            maxLength={1000}
          />
          <div className="flex justify-end mt-3">
            <Button size="sm" className="gap-2 rounded-lg" onClick={handleSubmit} disabled={submitting}>
              <Send className="h-4 w-4" />
              {submitting ? "Đang gửi..." : userReview ? "Cập nhật" : "Gửi đánh giá"}
            </Button>
          </div>
        </div>
      )}

      {!user && (
        <p className="text-sm text-muted-foreground mb-6">
          <a href="/login" className="text-primary hover:underline">Đăng nhập</a> để viết đánh giá.
        </p>
      )}

      {/* Reviews list */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Đang tải đánh giá...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {(r.profile_name || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{r.profile_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i <= r.rating ? "fill-warning text-warning" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                {r.comment && (
                  <p className="text-sm text-card-foreground leading-relaxed">{r.comment}</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
