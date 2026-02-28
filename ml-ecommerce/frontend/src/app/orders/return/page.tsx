'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
  Package, ArrowLeft, CheckCircle, AlertCircle, 
  Upload, Image, Loader2, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
}

export default function ReturnRequestPage() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [returnReason, setReturnReason] = useState('');
  const [returnType, setReturnType] = useState<'refund' | 'exchange'>('refund');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // Get order ID from URL or use sample
  const orderId = 'sample-order-id'; // In real app, get from URL params

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then(r => r.data.data),
    // For demo, return mock data
    queryFn: async () => ({
      id: orderId,
      orderNumber: 'ORD-2024-001234',
      status: 'delivered',
      deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      orderItems: [
        { id: '1', productName: 'Premium Wireless Headphones', productImage: null, quantity: 1, unitPrice: 299.99 },
        { id: '2', productName: 'USB-C Charging Cable', productImage: null, quantity: 2, unitPrice: 19.99 },
        { id: '3', productName: 'Phone Case - Black', productImage: null, quantity: 1, unitPrice: 39.99 },
      ] as OrderItem[]
    }),
  });

  const createReturnMutation = useMutation({
    mutationFn: (data: any) => api.post('/returns', data),
    onSuccess: () => {
      router.push('/orders?tab=returns');
    },
  });

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAll = () => {
    if (!order?.orderItems) return;
    if (selectedItems.length === order.orderItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(order.orderItems.map((item: OrderItem) => item.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      alert('Please select at least one item to return');
      return;
    }

    if (!returnReason) {
      alert('Please select a reason for return');
      return;
    }

    createReturnMutation.mutate({
      orderId,
      items: selectedItems,
      reason: returnReason,
      type: returnType,
      additionalInfo,
      images,
    });
  };

  const canReturn = order && order.status === 'delivered' && 
    (new Date().getTime() - new Date(order.deliveredAt).getTime()) < 30 * 24 * 60 * 60 * 1000;

  const returnReasons = [
    { value: 'defective', label: 'Product is defective or damaged' },
    { value: 'wrong_item', label: 'Wrong item received' },
    { value: 'not_as_described', label: 'Not as described' },
    { value: 'no_longer_needed', label: 'No longer needed' },
    { value: 'better_price', label: 'Found better price elsewhere' },
    { value: 'other', label: 'Other' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!canReturn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-12">
        <div className="container mx-auto px-4 max-w-md">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Order
          </button>

          <div className="card p-8 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Return Not Available
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              This order is no longer eligible for returns. Returns must be requested within 30 days of delivery.
            </p>
            <button 
              onClick={() => router.push('/orders')}
              className="btn-primary"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedTotal = order?.orderItems
    ?.filter((item: OrderItem) => selectedItems.includes(item.id))
    .reduce((sum: number, item: OrderItem) => sum + (item.unitPrice * item.quantity), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Order
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Request a Return
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Order #{order?.orderNumber}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Select Items */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                1. Select Items to Return
              </h2>
              <button
                type="button"
                onClick={selectAll}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {selectedItems.length === order?.orderItems?.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="space-y-3">
              {order?.orderItems?.map((item: OrderItem) => (
                <label
                  key={item.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                    selectedItems.includes(item.id)
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                      : "border-gray-200 dark:border-dark-700 hover:border-gray-300"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="w-16 h-16 bg-gray-200 dark:bg-dark-700 rounded-lg flex items-center justify-center">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                </label>
              ))}
            </div>

            {selectedItems.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Return Total:
                </span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  ${selectedTotal.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Step 2: Return Type */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              2. Return Type
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <label
                className={cn(
                  "flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                  returnType === 'refund'
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                    : "border-gray-200 dark:border-dark-700 hover:border-gray-300"
                )}
              >
                <input
                  type="radio"
                  name="returnType"
                  value="refund"
                  checked={returnType === 'refund'}
                  onChange={() => setReturnType('refund')}
                  className="sr-only"
                />
                <CheckCircle className={cn(
                  "w-8 h-8 mb-2",
                  returnType === 'refund' ? "text-primary-600" : "text-gray-400"
                )} />
                <span className="font-medium text-gray-900 dark:text-white">Full Refund</span>
                <span className="text-sm text-gray-500 mt-1 text-center">
                  Get money back to original payment method
                </span>
              </label>

              <label
                className={cn(
                  "flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                  returnType === 'exchange'
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                    : "border-gray-200 dark:border-dark-700 hover:border-gray-300"
                )}
              >
                <input
                  type="radio"
                  name="returnType"
                  value="exchange"
                  checked={returnType === 'exchange'}
                  onChange={() => setReturnType('exchange')}
                  className="sr-only"
                />
                <Package className={cn(
                  "w-8 h-8 mb-2",
                  returnType === 'exchange' ? "text-primary-600" : "text-gray-400"
                )} />
                <span className="font-medium text-gray-900 dark:text-white">Exchange</span>
                <span className="text-sm text-gray-500 mt-1 text-center">
                  Get a replacement for the item
                </span>
              </label>
            </div>
          </div>

          {/* Step 3: Reason */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              3. Reason for Return
            </h2>
            
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="input w-full"
              required
            >
              <option value="">Select a reason</option>
              {returnReasons.map(reason => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          {/* Step 4: Additional Info */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              4. Additional Information (Optional)
            </h2>
            
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Please provide any additional details about your return..."
              className="input w-full h-32 resize-none"
            />

            {/* Image Upload */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Photos (Optional)
              </label>
              <div className="flex gap-2 flex-wrap">
                {images.map((img, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Add</span>
                  <input type="file" className="hidden" accept="image/*" multiple />
                </label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card p-6 bg-gray-50 dark:bg-dark-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Return Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Items to Return:</span>
                <span className="text-gray-900 dark:text-white">{selectedItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Return Type:</span>
                <span className="text-gray-900 dark:text-white capitalize">{returnType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Refund Amount:</span>
                <span className="text-primary-600 dark:text-primary-400 font-bold">
                  ${selectedTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={createReturnMutation.isPending || selectedItems.length === 0}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2"
          >
            {createReturnMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Return Request
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
