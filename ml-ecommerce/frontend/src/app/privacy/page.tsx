'use client';

import Link from 'next/link';
import { Shield, Eye, Lock, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
        </div>

        <div className="space-y-6 text-gray-600 dark:text-gray-400">
          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary-600" />
              Information We Collect
            </h2>
            <p>We collect information you provide directly to us, including name, email, shipping address, and payment information. We also collect automatically when you use our services.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary-600" />
              How We Use Your Information
            </h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you about orders, products, and promotional offers.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary-600" />
              Your Rights
            </h2>
            <p>You have the right to access, update, or delete your personal information. You can manage your account settings or contact us for assistance.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@intellicore.shop</p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
