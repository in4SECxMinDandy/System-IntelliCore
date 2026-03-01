'use client';

import Link from 'next/link';
import { RotateCcw, Package, AlertCircle, CheckCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <RotateCcw className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Returns & Refunds</h1>
        </div>

        <div className="space-y-6">
          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary-600" />
              Return Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We offer a 30-day return policy for most items. To be eligible for a return, your item must be unused and in the same condition that you received it.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Item must be in original packaging</li>
              <li>Proof of purchase required</li>
              <li>Items must not be damaged by customer</li>
              <li>Shipping costs may apply</li>
            </ul>
          </section>

          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              How to Return
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Go to your Orders page</li>
              <li>Select the order containing the item you want to return</li>
              <li>Click "Request Return" and follow the prompts</li>
              <li>Print the prepaid shipping label (if applicable)</li>
              <li>Ship the item within 14 days</li>
            </ol>
          </section>

          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary-600" />
              Refund Process
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Once we receive your returned item, we'll inspect it and notify you of the status. Refunds are typically processed within 5-7 business days after approval. The amount will be credited to your original payment method.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/orders" className="text-primary-600 hover:underline">View Your Orders →</Link>
        </div>
      </div>
    </div>
  );
}
