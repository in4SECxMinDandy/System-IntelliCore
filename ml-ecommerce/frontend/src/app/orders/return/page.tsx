'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, ArrowLeft, CheckCircle, AlertCircle, 
  Upload, Image, Loader2, X, ArrowBack
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIPolicyCard } from '@/components/orders/AIPolicyCard';

interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  returnable?: boolean;
}

const returnReasons = [
  { value: 'defective', label: 'Defective or Damaged' },
  { value: 'wrong_item', label: 'Wrong Item Sent' },
  { value: 'better_price', label: 'Better Price Available' },
  { value: 'no_longer_needed', label: 'No Longer Needed' },
  { value: 'late_delivery', label: 'Item arrived too late' },
];

export default function ReturnRequestPage() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>(['1']);
  const [returnReason, setReturnReason] = useState('defective');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock order data
  const mockOrder = {
    id: '123456789',
    orderNumber: 'ML-883855',
    placedDate: 'Oct 24, 2023',
    eligibleUntil: 'Nov 24, 2023',
    items: [
      { id: '1', productName: 'Wireless Noise Cancelling Headphones', productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY2L0948Xkb5PY-ZtVija1bwB9e90Jg1VxVIDuPGAJIEkqWsaL5fskTMRyJvNuufVmvV4BFkQwJiUmxSTwQ9F-Wzfbddb-JYnbIUNrF2e9sVYW9c3vJ29flbX8r5sewvHnPZ3TSjiAt7z-43yXKF_K-Q4539TImr5wk6NaQ765rHD-r_umDZbKyWHb8oqETFcoDWZW4qIRc_Eu8FnITxFgD32iceU8QI9300texksB7-UcT2Hfq4Xg0kIm3a8IAB6WClZ2x63G8dI', quantity: 1, unitPrice: 299.00, returnable: true },
      { id: '2', productName: 'Smart Watch Series 7', productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNdbaTsXpdS3lqlPTuP5llbhEzxxOMlvSVFAduYCWnpSzRmnlX-5p6B_DReH8NZfo2EotOoDNizk2oQSn6s7ohlqEPPw_exxrKODO3kx1-mQv9i_2bAAtPUM2DuTAthYaqKqG2X9N-VrwJRn1jLDJHAfn1NMEf7g9I5Ae5cnB8PxpHb0geOf5Dh_nhLxrGe4S6XIC1o96QiI5-8qyjR1xeXQ-HQEL0QEVFEI14tlUmfrNdbAxzG2JntCnpOYcWT0kZTZx4LG04qKU', quantity: 1, unitPrice: 399.00, returnable: false },
      { id: '3', productName: 'USB-C Fast Charging Cable', productImage: '', quantity: 1, unitPrice: 19.00, returnable: true },
    ] as OrderItem[],
  };

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === mockOrder.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(mockOrder.items.map(item => item.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('Return request submitted successfully!');
    router.push('/orders');
  };

  const selectedTotal = mockOrder.items
    ?.filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) || 0;

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#181411] py-10 px-4 md:px-10">
      <div className="max-w-[960px] mx-auto flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#393028] pb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary-500 mb-1">
              <ArrowBack className="w-4 h-4" />
              <Link href="/orders" className="text-sm font-medium uppercase tracking-wider hover:underline">
                Back to Orders
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl md:text-5xl font-bold text-white leading-tight tracking-[-0.033em]">
              Cancel Order & Returns
            </h1>
            <p className="text-[#baab9c] text-lg font-normal">
              Order #{mockOrder.orderNumber} • Placed on {mockOrder.placedDate}
            </p>
          </div>
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold">Eligible for Return until {mockOrder.eligibleUntil}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Items Selection */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* AI Policy Check Card */}
            <AIPolicyCard 
              title="Good news! You're eligible for a full refund."
              description="Based on your order status and return history, this request qualifies for an instant approval. No restocking fees apply if returned within 30 days."
              eligible={true}
            />

            {/* Select Items Section */}
            <section className="bg-[#221910] rounded-xl border border-[#393028] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Select Items to Return</h2>
                <button 
                  onClick={selectAll}
                  className="text-primary-500 text-sm font-medium hover:underline"
                >
                  Select All
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {mockOrder.items.map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer group',
                      selectedItems.includes(item.id)
                        ? 'border-primary-500 bg-primary-500/5'
                        : 'border-[#393028] bg-[#2b2116]/50 hover:bg-[#342a20]'
                    )}
                  >
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItem(item.id)}
                        className="w-5 h-5 rounded border-[#54473b] border-2 bg-transparent text-primary-500 focus:ring-0 focus:ring-offset-0 focus:border-primary-500 focus:outline-none accent-primary-500"
                      />
                    </div>
                    <div className="h-20 w-20 rounded-lg bg-[#393028] shrink-0 overflow-hidden flex items-center justify-center">
                      {item.productImage ? (
                        <img 
                          alt={item.productName} 
                          className="h-full w-full object-cover" 
                          src={item.productImage} 
                        />
                      ) : (
                        <span className="material-symbols-outlined text-gray-400 text-3xl">cable</span>
                      )}
                    </div>
                    <div className="flex flex-col grow gap-1">
                      <div className="flex justify-between items-start w-full">
                        <p className="text-white text-base font-semibold leading-tight">
                          {item.productName}
                        </p>
                        <span className="text-white font-bold">${item.unitPrice.toFixed(2)}</span>
                      </div>
                      <p className="text-[#baab9c] text-sm">
                        {item.productName.includes('Watch') ? 'Size: 44mm • Color: Midnight' : 
                         item.productName.includes('Cable') ? 'Length: 2m' : 'Color: Black • Qty: 1'}
                      </p>
                      {item.returnable && (
                        <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Returnable
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Reason & Summary */}
          <div className="flex flex-col gap-6">
            {/* Reason Card */}
            <div className="bg-[#221910] rounded-xl border border-[#393028] p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Reason for Return</h2>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-[#baab9c] uppercase tracking-wider mb-2 block">
                    Reason Code
                  </label>
                  <select 
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full bg-[#1f1a14] border border-[#393028] text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-3"
                  >
                    {returnReasons.map(reason => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#baab9c] uppercase tracking-wider mb-2 block">
                    Additional Comments
                  </label>
                  <textarea 
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Please provide more details..."
                    className="w-full bg-[#1f1a14] border border-[#393028] text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-3 h-32 resize-none"
                  />
                </div>

                <div className="h-px bg-[#393028] my-2" />

                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#baab9c]">Refund Method</span>
                  <span className="text-white font-medium">Original Payment</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#baab9c]">Estimated Refund</span>
                  <span className="text-primary-500 font-bold text-lg">${selectedTotal.toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || selectedItems.length === 0}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg shadow-primary-500/20 transition-all mt-2 flex items-center justify-center gap-2 text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Request Refund</span>
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </>
                  )}
                </button>
                
                <p className="text-center text-xs text-[#baab9c] mt-2">
                  By continuing, you agree to our <a href="#" className="underline hover:text-white">Return Policy</a>.
                </p>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-blue-500/10 rounded-xl p-5 border border-blue-500/20">
              <div className="flex gap-3">
                <div className="bg-blue-500/20 rounded-full p-2 h-fit text-blue-400">
                  <span className="material-symbols-outlined">headset_mic</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Need help with this return?</h4>
                  <p className="text-xs text-blue-200/70 mb-3">Our support team is available 24/7 to assist you with any questions.</p>
                  <a href="#" className="text-xs font-bold text-blue-400 hover:underline">Contact Support</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
