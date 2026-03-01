// ==========================================
// API Client
// ==========================================

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Extend axios config to support _retry property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 second timeout
});

// Types for API errors
export interface ApiError {
  success: boolean;
  message: string;
  error?: string;
}

// Check if error is network-related
const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return (
      !error.response ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ERR_NETWORK' ||
      error.message.includes('Network Error')
    );
  }
  return false;
};

// Get user-friendly error message
export const getErrorMessage = (error: unknown): string => {
  if (isNetworkError(error)) {
    return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.';
  }

  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError;
    if (data?.message) return data.message;
    if (error.response?.status === 401) return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    if (error.response?.status === 403) return 'Bạn không có quyền truy cập.';
    if (error.response?.status === 404) return 'Không tìm thấy dữ liệu.';
    if (error.response?.status === 500) return 'Lỗi server. Vui lòng thử lại sau.';
  }

  return 'Đã xảy ra lỗi. Vui lòng thử lại.';
};

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Primary: direct localStorage key (set on login)
    let token = localStorage.getItem('accessToken');
    // Fallback: Zustand persist JSON storage
    if (!token) {
      try {
        const stored = localStorage.getItem('auth-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          token = parsed?.state?.accessToken || null;
        }
      } catch { }
    }
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401 and handle network errors
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as CustomAxiosRequestConfig;

    // Handle network errors (ERR_EMPTY_RESPONSE, ECONNABORTED, etc.)
    if (!error.response && original) {
      console.error('Network error:', error.message);
      // Don't retry if it's a timeout
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('Yêu cầu đã hết thời gian chờ. Vui lòng thử lại.'));
      }
      // Don't retry if we've already tried
      if (original._retry) {
        return Promise.reject(error);
      }
    }

    // Handle 401 - Token expired
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    // Log error for debugging
    if (error.response) {
      console.error(`API Error ${error.response.status}:`, error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ==========================================
// Community API
// ==========================================
export const communityApi = {
  getPosts: (params?: { page?: number; limit?: number }) =>
    api.get('/community/posts', { params }),
  getPost: (id: string) => api.get(`/community/posts/${id}`),
  createPost: (data: { content: string; images?: string[]; productId?: string }) =>
    api.post('/community/posts', data),
  likePost: (postId: string) => api.post(`/community/posts/${postId}/like`),
  addComment: (postId: string, data: { content: string }) =>
    api.post(`/community/posts/${postId}/comments`, data),
  getChallenges: () => api.get('/community/challenges'),
  joinChallenge: (challengeId: string) => api.post(`/community/challenges/${challengeId}/join`),
  getLeaderboard: (params?: { limit?: number }) => api.get('/community/leaderboard', { params }),
  followUser: (userId: string) => api.post(`/community/users/${userId}/follow`),
  getFollowers: (userId: string) => api.get(`/community/users/${userId}/followers`),
  getFollowing: (userId: string) => api.get(`/community/users/${userId}/following`),
};

// ==========================================
// Reviews API
// ==========================================
export const reviewsApi = {
  getProductReviews: (productId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/reviews/product/${productId}`, { params }),
  createReview: (data: { productId: string; rating: number; title: string; content: string; images?: string[] }) =>
    api.post('/reviews', data),
  getUserReviews: () => api.get('/reviews/user'),
};

// ==========================================
// Products API
// ==========================================
export const productsApi = {
  list: (params?: { page?: number; limit?: number; category?: string; search?: string }) =>
    api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  search: (q: string) => api.get('/products/search', { params: { q } }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
};

// ==========================================
// Orders API
// ==========================================
export const ordersApi = {
  list: (params?: { page?: number; status?: string }) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  getAdminOrders: (params?: { page?: number; status?: string }) => api.get('/orders/admin/all', { params }),
};

export default api;
