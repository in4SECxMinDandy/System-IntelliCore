import Link from 'next/link';
import { Zap, Github, Twitter, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'New Arrivals', href: '/products?sort=newest' },
    { name: 'Best Sellers', href: '/products?sort=popular' },
    { name: 'Flash Deals', href: '/deals' },
    { name: 'Brands', href: '/brands' },
  ],
  account: [
    { name: 'My Account', href: '/profile' },
    { name: 'Orders', href: '/orders' },
    { name: 'Wishlist', href: '/wishlist' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Notifications', href: '/notifications' },
  ],
  community: [
    { name: 'Forum', href: '/community' },
    { name: 'Leaderboard', href: '/community/leaderboard' },
    { name: 'Challenges', href: '/community/challenges' },
    { name: 'Reviews', href: '/community/reviews' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-dark-900 border-t border-gray-100 dark:border-dark-800">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Stay in the loop</h3>
              <p className="text-primary-100 text-sm">Get personalized deals and AI recommendations in your inbox.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-2.5 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-white text-primary-600 font-semibold text-sm rounded-lg hover:bg-primary-50 transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">IntelliCore</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
              AI-powered shopping platform with personalized recommendations, community features, and seamless checkout.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Mail className="w-4 h-4 shrink-0" />
                <span>support@intellicore.shop</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>San Francisco, CA 94102</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm uppercase tracking-wider">Community</h4>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} IntelliCore Shop. All rights reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500 mr-1">Secure payments:</span>
              {['Visa', 'MC', 'PayPal', 'Stripe'].map((method) => (
                <span
                  key={method}
                  className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-gray-400 text-xs rounded font-medium"
                >
                  {method}
                </span>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
