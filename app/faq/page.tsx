'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'How do I find my correct frame size?',
    answer:
      'You can find your frame size on the inside of your current frames. It typically shows three numbers (e.g., 50-18-140) representing eye size, bridge width, and temple length. Check our Size & Fit Guide for more detailed information.',
  },
  {
    id: 2,
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day return policy on all products. Items must be unused and in original packaging. Simply contact our customer service team to initiate a return.',
  },
  {
    id: 3,
    question: 'Do you offer prescription lenses?',
    answer:
      'Currently, we offer frames only. However, most of our frames are compatible with standard prescription lenses. You can take your purchased frames to any optometrist to add prescription lenses.',
  },
  {
    id: 4,
    question: 'How long does shipping take?',
    answer:
      'Standard shipping typically takes 5-7 business days. Express shipping options are available for 2-3 business day delivery. Shipping times may vary based on your location.',
  },
  {
    id: 5,
    question: 'Are your products authentic?',
    answer:
      'Yes, all our products are 100% authentic. We work directly with manufacturers and authorized distributors to ensure authenticity and quality.',
  },
  {
    id: 6,
    question: 'Do you offer warranty on frames?',
    answer:
      'Yes, all frames come with a 1-year manufacturer warranty covering defects in materials and workmanship. This does not cover damage from misuse or accidents.',
  },
  {
    id: 7,
    question: 'Can I use multiple discount codes?',
    answer:
      'No, only one discount code can be applied per order. If you have multiple codes, we recommend using the one that provides the best savings.',
  },
  {
    id: 8,
    question: 'How do I care for my frames?',
    answer:
      'Use our provided microfiber cloth to clean your frames daily. Store them in the protective case when not wearing. Avoid extreme heat and direct sunlight. Check our Size & Fit Guide for detailed care instructions.',
  },
  {
    id: 9,
    question: 'Do you have a physical store?',
    answer:
      'Currently, we operate online only. However, we offer virtual consultations with our style experts. Contact our customer service to schedule a free consultation.',
  },
  {
    id: 10,
    question: 'How do I track my order?',
    answer:
      'Once your order ships, you will receive an email with a tracking number. You can use this to track your package in real-time on our website or the carrier\'s website.',
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={20} className="text-gray-600" />
            <span className="text-gray-600 hover:text-gray-900">Back</span>
          </Link>
          <h1 className="text-xl font-light">Frequently Asked Questions</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <p className="text-gray-600 text-center">
            Find answers to common questions about our products and services.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(item.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-left font-semibold text-gray-900">
                  {item.question}
                </h3>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 flex-shrink-0 transition-transform ${
                    openId === item.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openId === item.id && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-light mb-3">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Our customer support team is here to help. Contact us anytime.
          </p>
          <a
            href="mailto:support@hubofframes.com"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </main>
    </div>
  );
}
