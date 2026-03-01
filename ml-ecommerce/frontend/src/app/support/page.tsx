'use client';

import Link from 'next/link';
import { Headphones, MessageCircle, Mail, Clock } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Headphones className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Support</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Live Chat</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Chat with our support team in real-time for immediate assistance.
            </p>
            <button className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Start Live Chat
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Email Support</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Send us an email and we'll respond within 24 hours.
            </p>
            <a href="mailto:support@intellicore.shop" className="block w-full py-2 text-center border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20">
              Send Email
            </a>
          </div>

          <div className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Support Hours</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-gray-600 dark:text-gray-400">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Monday - Friday</p>
                <p>9:00 AM - 6:00 PM</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Saturday</p>
                <p>10:00 AM - 4:00 PM</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Sunday</p>
                <p>Closed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
