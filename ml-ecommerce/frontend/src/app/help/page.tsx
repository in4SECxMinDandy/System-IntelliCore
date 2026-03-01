'use client';

import Link from 'next/link';
import { HelpCircle, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help Center</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">How do I track my order?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Go to Orders page and click on your order to see tracking details.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">How do I return a product?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Visit the Returns page or go to your order details and request a return.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">What payment methods do you accept?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">We accept Visa, Mastercard, PayPal, and Stripe.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-600" />
                <span className="text-gray-600 dark:text-gray-400">support@intellicore.shop</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-600" />
                <span className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-600" />
                <span className="text-gray-600 dark:text-gray-400">Mon-Fri: 9AM - 6PM</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-600" />
                <span className="text-gray-600 dark:text-gray-400">123 Commerce St, City, Country</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
