import { create } from 'zustand';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    salePrice?: number;
    images: { url: string }[];
  };
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number, variantId?: string) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    try {
      set({ loading: true });
      const { data } = await api.get('/cart');
      set({ items: data.data?.cartItems || [] });
    } catch {} finally {
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity = 1, variantId) => {
    try {
      await api.post('/cart/items', { productId, quantity, variantId });
      await get().fetchCart();
      toast.success('Added to cart');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  },

  updateItem: async (itemId, quantity) => {
    try {
      await api.put(`/cart/items/${itemId}`, { quantity });
      await get().fetchCart();
    } catch {}
  },

  removeItem: async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      await get().fetchCart();
      toast.success('Removed from cart');
    } catch {}
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
      set({ items: [] });
    } catch {}
  },

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  totalPrice: () => get().items.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.basePrice;
    return sum + price * item.quantity;
  }, 0),
}));
