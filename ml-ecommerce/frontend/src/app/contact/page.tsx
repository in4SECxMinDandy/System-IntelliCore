'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Get in Touch</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
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
                <MapPin className="w-5 h-5 text-primary-600" />
                <span className="text-gray-600 dark:text-gray-400">123 Commerce St, City, Country</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-600" />
                <span className="text-gray-600 dark:text-gray-400">Mon-Fri: 9AM - 6PM</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-dark-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white" placeholder="How can we help?"></textarea>
              </div>
              <button type="button" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
