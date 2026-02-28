// ==========================================
// i18n Configuration — IntelliCore Frontend
// Multi-language support with next-intl
// ==========================================

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales
export const locales = ['en', 'vi', 'zh', 'ja', 'ko'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Locale names for display
export const localeNames: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
};

// Currency configurations
export const currencies = {
  en: { code: 'USD', symbol: '$', locale: 'en-US' },
  vi: { code: 'VND', symbol: '₫', locale: 'vi-VN' },
  zh: { code: 'CNY', symbol: '¥', locale: 'zh-CN' },
  ja: { code: 'JPY', symbol: '¥', locale: 'ja-JP' },
  ko: { code: 'KRW', symbol: '₩', locale: 'ko-KR' },
} as const;

export type CurrencyCode = keyof typeof currencies;

// Translations
const translations = {
  // Common
  common: {
    // Navbar
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
    
    // Buttons
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
    
    // Status
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
    
    // Messages
    no_results: 'No results found',
    something_went_wrong: 'Something went wrong',
    try_again: 'Try Again',
    coming_soon: 'Coming Soon',
    
    // Time
    just_now: 'Just now',
    minutes_ago: '{count} minutes ago',
    hours_ago: '{count} hours ago',
    days_ago: '{count} days ago',
    weeks_ago: '{count} weeks ago',
  },
  
  // Auth
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
    or_continue_with: 'Or continue with',
    forgot_password_title: 'Reset Password',
    forgot_password_subtitle: 'Enter your email to receive a reset link',
    reset_password: 'Reset Password',
    check_email: 'Check your email for a reset link',
  },
  
  // Products
  products: {
    title: 'Products',
    featured: 'Featured Products',
    new_arrivals: 'New Arrivals',
    best_sellers: 'Best Sellers',
    on_sale: 'On Sale',
    price: 'Price',
    price_range: 'Price Range',
    min_price: 'Min Price',
    max_price: 'Max Price',
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
    similar_products: 'Similar Products',
    frequently_bought_together: 'Frequently Bought Together',
    customer_reviews: 'Customer Reviews',
    write_review: 'Write a Review',
    sort_by: 'Sort By',
    filter_by: 'Filter By',
    newest: 'Newest',
    price_low_high: 'Price: Low to High',
    price_high_low: 'Price: High to Low',
    top_rated: 'Top Rated',
    best_selling: 'Best Selling',
  },
  
  // Cart & Checkout
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
    proceed_to_checkout: 'Proceed to Checkout',
    order_summary: 'Order Summary',
    shipping_info: 'Shipping Information',
    payment_method: 'Payment Method',
    place_order: 'Place Order',
    order_placed: 'Order Placed Successfully!',
    order_number: 'Order Number',
    thank_you: 'Thank you for your order!',
  },
  
  // Orders
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
    reorder: 'Reorder',
    cancel_order: 'Cancel Order',
    return_item: 'Return Item',
    request_return: 'Request Return',
    status_timeline: {
      pending: 'Order Placed',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
    },
  },
  
  // Community
  community: {
    title: 'Community',
    feed: 'Feed',
    posts: 'Posts',
    create_post: 'Create Post',
    share_thoughts: 'Share your thoughts...',
    likes: 'Likes',
    comments: 'Comments',
    share: 'Share',
    challenges: 'Challenges',
    leaderboard: 'Leaderboard',
    follow: 'Follow',
    following: 'Following',
    followers: 'Followers',
  },
  
  // Admin
  admin: {
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    users: 'Users',
    products: 'Products',
    orders: 'Orders',
    inventory: 'Inventory',
    reviews: 'Reviews',
    coupons: 'Coupons',
    flash_sales: 'Flash Sales',
    reports: 'Reports',
    settings: 'Settings',
  },
  
  // Footer
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
    newsletter_subtitle: 'Subscribe for exclusive offers',
    subscribe: 'Subscribe',
    all_rights_reserved: 'All rights reserved',
  },
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
