// ==========================================
// useLanguage Hook — IntelliCore Frontend
// Hook for accessing current language and translations
// ==========================================

import { useState, useEffect, useCallback } from 'react';

type Language = 'en' | 'vi';

interface Translations {
  [key: string]: string | Translations;
}

// English translations
const en: Translations = {
  common: {
    home: 'Home',
    products: 'Products',
    community: 'Community',
    about: 'About',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    dashboard: 'Dashboard',
    settings: 'Settings',
    search: 'Search',
    search_placeholder: 'Search for products...',
    cart: 'Cart',
    wishlist: 'Wishlist',
    notifications: 'Notifications',
    language: 'Language',
    currency: 'Currency',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    confirm: 'Confirm',
    apply: 'Apply',
    filter: 'Filter',
    sort: 'Sort',
    clear: 'Clear',
    reset: 'Reset',
    load_more: 'Load More',
    see_all: 'See All',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
    no_results: 'No results found',
    something_went_wrong: 'Something went wrong',
    try_again: 'Try Again',
    coming_soon: 'Coming Soon',
  },
  auth: {
    login_title: 'Welcome Back',
    login_subtitle: 'Sign in to your account',
    register_title: 'Create Account',
    register_subtitle: 'Join our community',
    email: 'Email Address',
    password: 'Password',
    confirm_password: 'Confirm Password',
    forgot_password: 'Forgot Password?',
    remember_me: 'Remember me',
    no_account: "Don't have an account?",
    have_account: 'Already have an account?',
    sign_up: 'Sign Up',
    sign_in: 'Sign In',
  },
  products: {
    title: 'Products',
    featured: 'Featured Products',
    new_arrivals: 'New Arrivals',
    best_sellers: 'Best Sellers',
    on_sale: 'On Sale',
    price: 'Price',
    category: 'Category',
    categories: 'Categories',
    brand: 'Brand',
    brands: 'Brands',
    rating: 'Rating',
    reviews: 'Reviews',
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    add_to_cart: 'Add to Cart',
    buy_now: 'Buy Now',
    added_to_cart: 'Added to Cart',
    view_cart: 'View Cart',
    continue_shopping: 'Continue Shopping',
    product_details: 'Product Details',
    description: 'Description',
    specifications: 'Specifications',
    related_products: 'Related Products',
  },
  cart: {
    title: 'Shopping Cart',
    your_cart: 'Your Cart',
    empty_cart: 'Your cart is empty',
    continue_shopping: 'Continue Shopping',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    discount: 'Discount',
    total: 'Total',
    checkout: 'Proceed to Checkout',
    remove_item: 'Remove Item',
    update_quantity: 'Update Quantity',
    place_order: 'Place Order',
    order_placed: 'Order Placed Successfully!',
    thank_you: 'Thank you for your order!',
  },
  orders: {
    title: 'My Orders',
    order_details: 'Order Details',
    order_number: 'Order Number',
    order_date: 'Order Date',
    order_status: 'Order Status',
    payment_status: 'Payment Status',
    tracking: 'Track Order',
    track_order: 'Track Order',
    order_history: 'Order History',
    cancel_order: 'Cancel Order',
    return_item: 'Return Item',
  },
  footer: {
    about: 'About Us',
    contact: 'Contact Us',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    shipping: 'Shipping Policy',
    returns: 'Returns & Refunds',
    faq: 'FAQ',
    support: 'Support',
    newsletter: 'Newsletter',
    subscribe: 'Subscribe',
    all_rights_reserved: 'All rights reserved',
  },
};

// Vietnamese translations
const vi: Translations = {
  common: {
    home: 'Trang chủ',
    products: 'Sản phẩm',
    community: 'Cộng đồng',
    about: 'Giới thiệu',
    contact: 'Liên hệ',
    login: 'Đăng nhập',
    register: 'Đăng ký',
    logout: 'Đăng xuất',
    profile: 'Hồ sơ',
    dashboard: 'Bảng điều khiển',
    settings: 'Cài đặt',
    search: 'Tìm kiếm',
    search_placeholder: 'Tìm sản phẩm...',
    cart: 'Giỏ hàng',
    wishlist: 'Yêu thích',
    notifications: 'Thông báo',
    language: 'Ngôn ngữ',
    currency: 'Tiền tệ',
    submit: 'Gửi',
    cancel: 'Hủy',
    save: 'Lưu',
    delete: 'Xóa',
    edit: 'Sửa',
    view: 'Xem',
    close: 'Đóng',
    back: 'Quay lại',
    next: 'Tiếp theo',
    previous: 'Trước',
    confirm: 'Xác nhận',
    apply: 'Áp dụng',
    filter: 'Lọc',
    sort: 'Sắp xếp',
    clear: 'Xóa',
    reset: 'Đặt lại',
    load_more: 'Tải thêm',
    see_all: 'Xem tất cả',
    loading: 'Đang tải...',
    error: 'Lỗi',
    success: 'Thành công',
    warning: 'Cảnh báo',
    info: 'Thông tin',
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
    failed: 'Thất bại',
    cancelled: 'Đã hủy',
    no_results: 'Không tìm thấy kết quả',
    something_went_wrong: 'Đã xảy ra lỗi',
    try_again: 'Thử lại',
    coming_soon: 'Sắp ra mắt',
  },
  auth: {
    login_title: 'Chào mừng trở lại',
    login_subtitle: 'Đăng nhập vào tài khoản',
    register_title: 'Tạo tài khoản',
    register_subtitle: 'Tham gia cộng đồng',
    email: 'Địa chỉ email',
    password: 'Mật khẩu',
    confirm_password: 'Xác nhận mật khẩu',
    forgot_password: 'Quên mật khẩu?',
    remember_me: 'Ghi nhớ đăng nhập',
    no_account: 'Chưa có tài khoản?',
    have_account: 'Đã có tài khoản?',
    sign_up: 'Đăng ký',
    sign_in: 'Đăng nhập',
  },
  products: {
    title: 'Sản phẩm',
    featured: 'Sản phẩm nổi bật',
    new_arrivals: 'Sản phẩm mới',
    best_sellers: 'Bán chạy nhất',
    on_sale: 'Giảm giá',
    price: 'Giá',
    category: 'Danh mục',
    categories: 'Danh mục',
    brand: 'Thương hiệu',
    brands: 'Thương hiệu',
    rating: 'Đánh giá',
    reviews: 'Đánh giá',
    in_stock: 'Còn hàng',
    out_of_stock: 'Hết hàng',
    add_to_cart: 'Thêm vào giỏ',
    buy_now: 'Mua ngay',
    added_to_cart: 'Đã thêm vào giỏ',
    view_cart: 'Xem giỏ hàng',
    continue_shopping: 'Tiếp tục mua sắm',
    product_details: 'Chi tiết sản phẩm',
    description: 'Mô tả',
    specifications: 'Thông số kỹ thuật',
    related_products: 'Sản phẩm liên quan',
  },
  cart: {
    title: 'Giỏ hàng',
    your_cart: 'Giỏ hàng của bạn',
    empty_cart: 'Giỏ hàng trống',
    continue_shopping: 'Tiếp tục mua sắm',
    subtotal: 'Tạm tính',
    shipping: 'Vận chuyển',
    tax: 'Thuế',
    discount: 'Giảm giá',
    total: 'Tổng cộng',
    checkout: 'Thanh toán',
    remove_item: 'Xóa sản phẩm',
    update_quantity: 'Cập nhật số lượng',
    place_order: 'Đặt hàng',
    order_placed: 'Đặt hàng thành công!',
    thank_you: 'Cảm ơn bạn đã đặt hàng!',
  },
  orders: {
    title: 'Đơn hàng của tôi',
    order_details: 'Chi tiết đơn hàng',
    order_number: 'Mã đơn hàng',
    order_date: 'Ngày đặt hàng',
    order_status: 'Trạng thái đơn hàng',
    payment_status: 'Trạng thái thanh toán',
    tracking: 'Theo dõi',
    track_order: 'Theo dõi đơn hàng',
    order_history: 'Lịch sử đơn hàng',
    cancel_order: 'Hủy đơn hàng',
    return_item: 'Trả hàng',
  },
  footer: {
    about: 'Về chúng tôi',
    contact: 'Liên hệ',
    privacy: 'Chính sách bảo mật',
    terms: 'Điều khoản dịch vụ',
    shipping: 'Chính sách vận chuyển',
    returns: 'Đổi trả & Hoàn tiền',
    faq: 'Câu hỏi thường gặp',
    support: 'Hỗ trợ',
    newsletter: 'Bản tin',
    subscribe: 'Đăng ký',
    all_rights_reserved: 'Tất cả các quyền được bảo lưu',
  },
};

const translations: Record<Language, Translations> = { en, vi };

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize language from localStorage or browser
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'en' || saved === 'vi')) {
      setLanguage(saved);
    } else {
      // Check browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'vi') {
        setLanguage('vi');
      }
    }
    setIsLoaded(true);
  }, []);

  // Listen for language change events
  useEffect(() => {
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setLanguage(customEvent.detail as Language);
      }
    };
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    window.dispatchEvent(new CustomEvent('languagechange', { detail: lang }));
  }, []);

  // Translation function
  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: Translations | string = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k] as Translations | string;
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey] as Translations | string;
          } else {
            return key; // Return key if not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  }, [language]);

  return {
    language,
    changeLanguage,
    t,
    isLoaded,
    isEnglish: language === 'en',
    isVietnamese: language === 'vi',
  };
}

export default useLanguage;
