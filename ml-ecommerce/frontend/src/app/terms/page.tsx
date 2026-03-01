'use client';

import Link from 'next/link';
import { FileText, Scale, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Scale className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
        </div>

        <div className="space-y-6 text-gray-600 dark:text-gray-400">
          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Acceptance of Terms
            </h2>
            <p>By accessing and using IntelliCore services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary-600" />
              Use License
            </h2>
            <p>You are granted a limited, non-exclusive, non-transferable license to use IntelliCore for personal, non-commercial purposes only.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Product Information</h2>
            <p>We strive to provide accurate product descriptions and pricing. However, errors may occur. We reserve the right to correct any errors and cancel orders if necessary.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Limitation of Liability</h2>
            <p>IntelliCore shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Contact Information</h2>
            <p>Questions about the Terms of Service should be sent to us at legal@intellicore.shop</p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
