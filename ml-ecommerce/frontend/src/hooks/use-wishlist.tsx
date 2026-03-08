import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface WishlistContextType {
  wishlistIds: Set<string>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setWishlistIds(new Set());
      return;
    }
    setLoading(true);
    supabase
      .from("wishlist")
      .select("product_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setWishlistIds(new Set(data?.map((w) => w.product_id) || []));
        setLoading(false);
      });
  }, [user]);

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.has(productId),
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!user) {
        toast.error("Vui lòng đăng nhập để sử dụng wishlist");
        return;
      }
      if (wishlistIds.has(productId)) {
        await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success("Đã xóa khỏi yêu thích");
      } else {
        await supabase
          .from("wishlist")
          .insert({ user_id: user.id, product_id: productId });
        setWishlistIds((prev) => new Set(prev).add(productId));
        toast.success("Đã thêm vào yêu thích");
      }
    },
    [user, wishlistIds]
  );

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
