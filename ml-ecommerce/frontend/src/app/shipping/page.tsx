'use client';

import Link from 'next/link';
import { Truck, Package, Clock, Globe } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Truck className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shipping Information</h1>
        </div>

        <div className="space-y-6">
          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              Delivery Times
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Standard Shipping</span>
                <span className="font-medium text-gray-900 dark:text-white">5-7 business days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Express Shipping</span>
                <span className="font-medium text-gray-900 dark:text-white">2-3 business days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Overnight Shipping</span>
                <span className="font-medium text-gray-900 dark:text-white">Next business day</span>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-600" />
              International Shipping
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We ship to over 100 countries worldwide. International delivery times vary by location, typically 10-21 business days.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              Order Processing
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Orders are processed within 1-2 business days. You'll receive a confirmation email with tracking information once your order ships.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
