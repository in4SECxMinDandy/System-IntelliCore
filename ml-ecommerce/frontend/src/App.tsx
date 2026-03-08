import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/hooks/use-cart";
import { AuthProvider } from "@/hooks/use-auth";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { CompareProvider } from "@/hooks/use-compare";
import MainLayout from "@/components/MainLayout";
import CompareBar from "@/components/CompareBar";
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrdersPage from "@/pages/OrdersPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import ChatbotWidget from "@/components/ChatbotWidget";
import WishlistPage from "@/pages/WishlistPage";
import ProfilePage from "@/pages/ProfilePage";
import ComparePage from "@/pages/ComparePage";
import HelpCenterPage from "@/pages/HelpCenterPage";
import ContactPage from "@/pages/ContactPage";
import ReturnPolicyPage from "@/pages/ReturnPolicyPage";
import AboutPage from "@/pages/AboutPage";
import CodPolicyPage from "@/pages/CodPolicyPage";
import CardPolicyPage from "@/pages/CardPolicyPage";
import MomoPolicyPage from "@/pages/MomoPolicyPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="stitch-theme">
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
        <WishlistProvider>
        <CompareProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:slug" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/deals" element={<ProductsPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/return-policy" element={<ReturnPolicyPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/cod-policy" element={<CodPolicyPage />} />
                <Route path="/card-policy" element={<CardPolicyPage />} />
                <Route path="/momo-policy" element={<MomoPolicyPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CompareBar />
            <ChatbotWidget />
          </BrowserRouter>
        </CompareProvider>
        </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
