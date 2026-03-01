'use client';

import Link from 'next/link';
import { RotateCcw, Package, DollarSign, Clock } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <RotateCcw className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Return Policy</h1>
        </div>

        <div className="space-y-6 text-gray-600 dark:text-gray-400">
          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              30-Day Return Window
            </h2>
            <p>
              We offer a 30-day return policy for most items. Items must be unused, in original packaging, and accompanied by the receipt or proof of purchase.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              Eligible Items
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Unused and unworn items with tags attached</li>
              <li>Items in original packaging</li>
              <li>Products not marked as final sale</li>
              <li>Defective or damaged items (contact support)</li>
            </ul>
          </section>

          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary-600" />
              Refund Process
            </h2>
            <p>
              Once we receive and inspect your return, we'll process your refund within 5-7 business days. The amount will be credited to your original payment method.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Non-Returnable Items</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Intimate apparel and swimwear</li>
              <li>Personal care items</li>
              <li>Digital products and software</li>
              <li>Gift cards</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 text-center space-y-2">
          <Link href="/returns" className="block text-primary-600 hover:underline">Request a Return →</Link>
          <Link href="/" className="block text-primary-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
