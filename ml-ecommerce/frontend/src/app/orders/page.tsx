'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import OrderSidebar from '@/components/OrderSidebar';
import OrderCard, { OrderStatus } from '@/components/OrderCard';

type TabValue = 'all' | 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product?: { name: string; imageUrl?: string; variant?: string };
}

interface Order {
  id: string;
  status: OrderStatus;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const TABS: { label: string; value: TabValue; count?: number }[] = [
  { label: 'All', value: 'all' },
  { label: 'To Pay', value: 'pending' },
  { label: 'To Ship', value: 'processing' },
  { label: 'To Receive', value: 'shipped', count: 2 },
  { label: 'Completed', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending: { label: 'Pending Payment', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
  processing: { label: 'Processing', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  shipped: { label: 'Shipped', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/30' },
  delivered: { label: 'Completed', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
};

const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { 
      router.push('/login'); 
      return; 
    }
    fetchOrders(1, true);
  }, [isAuthenticated, activeTab]);

  const fetchOrders = async (p: number, reset = false) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page: p, limit: 10 };
      if (activeTab !== 'all') params.status = activeTab;
      const { data } = await api.get('/orders', { params });
      const fetched: Order[] = data.data?.orders || data.data || [];
      setOrders(prev => reset ? fetched : [...prev, ...fetched]);
      setHasMore(fetched.length === 10);
      setPage(p);
    } catch {
      // Demo data for UI showcase
      setOrders(getDemoOrders());
    } finally {
      setLoading(false);
    }
  };

  const getDemoOrders = (): Order[] => [
    {
      id: 'ml-883921',
      status: 'out_for_delivery',
      paymentStatus: 'paid',
      totalAmount: 149.99,
      createdAt: '2023-10-24T10:00:00Z',
      updatedAt: '2023-10-25T09:00:00Z',
      items: [{
        id: '1',
        quantity: 1,
        unitPrice: 149.99,
        product: {
          name: 'CyberMech Pro Keyboard',
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ_PU8WIAXOKrkijveyvTQoy9Y2xOdxtEjq_Dev7tX-c8zIdHNeBTKOqdtwo4CitAiCknE-OIKIgus00ok3Xm-_fnIE2z8onEylXFmET6he9YfvlKglTQoTVAFGneh46m3zgvuw2ADHzDsNtL706wv2BodE06OBenJTqBViCLxf2Yk2bQS-v7jWdtWIZG5ruzh96qkjpH4qd3LjAOv26j5GsWKqg3l-_Rx2LweCRaR48wHgKGRzzTvsVZ86grTxgRnUNWQC_p4pdU',
          variant: 'TKL, Brown Switches'
        }
      }]
    },
    {
      id: 'ml-883920',
      status: 'shipped',
      paymentStatus: 'paid',
      totalAmount: 89.99,
      createdAt: '2023-10-22T14:00:00Z',
      updatedAt: '2023-10-23T10:00:00Z',
      items: [{
        id: '2',
        quantity: 1,
        unitPrice: 89.99,
        product: {
          name: 'Viper Ultimate Wireless',
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYQkZln_r0w_QkpufOP4Gpe8hGnkdhGtR5A2MK5JN9WQS3B7itETOx0iTmtAQMj8uRhdWg6eprNFaVfraVfosTp2DPNnJ4w3r5LP8llKN-NsKhZWy8LazSYqAMKPNH3br03gxFF0-HxIp8lsogWuEorppyQYiyJSP200d-icBLKjJPjPIz1_vlcp3bygRsveV339pYL9gLEMZ-1WQmTt_BBxA5glAu1woq7194MPNFa_gdkJ2oGxxKbKPO37XyG-4dVU-F-g6XpxA',
          variant: 'Black'
        }
      }]
    },
    {
      id: 'ml-883855',
      status: 'delivered',
      paymentStatus: 'paid',
      totalAmount: 449.00,
      createdAt: '2023-10-10T09:00:00Z',
      updatedAt: '2023-10-15T14:00:00Z',
      items: [{
        id: '3',
        quantity: 1,
        unitPrice: 449.00,
        product: {
          name: 'Galaxy Watch 5 Pro',
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK3OoVhw60PH673kCdEMSMBknIc1bGHhNC2glXDDVxSp7DL2D61Vy_6dNBulWOcjUmxEVo5kSlQbcSvX_XqlBHXeBPZpkT19cCFQ5LlLSjjTw1ScMMcNBr_mg1016V5tTWnsE4DrBOHKgNqq8xbH1brFs8DbryLeGM4vnqCsXR_xpQZB3DPy3yFwESU-Ox2rRK9cfAwTHYXFaqamOPbVE5FpoyFtgrt0iO6M7AB_qytifqt4dnSVSHSRkcf1FdcqTQxrGTWmUak3A',
          variant: 'Titanium Gray'
        }
      }]
    }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark dark:border-[#393028] px-6 md:px-10 py-3 bg-background-dark dark:bg-[#181411] sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-white">
            <div className="size-8 text-primary">
              <MaterialIcon className="text-4xl">view_in_ar</MaterialIcon>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">ML Market</h2>
          </div>
          <div className="hidden md:flex items-center gap-9">
            <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/">Home</Link>
            <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/products">Shop</Link>
            <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/deals">Deals</Link>
            <Link className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/support">Support</Link>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <label className="hidden lg:flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-card-dark dark:bg-[#221910] border border-border-dark dark:border-[#393028] focus-within:border-primary transition-colors">
              <div className="text-text-light dark:text-[#baab9c] flex items-center justify-center pl-4">
                <MaterialIcon className="text-xl">search</MaterialIcon>
              </div>
              <input 
                className="w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-text-light dark:placeholder:text-[#baab9c] px-4 text-sm font-normal" 
                placeholder="Search products..."
              />
            </div>
          </label>
          <div className="flex gap-3">
            <button className="flex items-center justify-center rounded-lg size-10 bg-card-dark dark:bg-[#221910] hover:bg-border-dark dark:hover:bg-[#393028] text-white transition-colors relative">
              <MaterialIcon className="text-[20px]">shopping_cart</MaterialIcon>
              <span className="absolute top-2 right-2 size-2 rounded-full bg-primary"></span>
            </button>
            <button className="flex items-center justify-center rounded-lg size-10 bg-card-dark dark:bg-[#221910] hover:bg-border-dark dark:hover:bg-[#393028] text-white transition-colors">
              <MaterialIcon className="text-[20px]">notifications</MaterialIcon>
            </button>
            <div className="size-10 rounded-full bg-cover bg-center border-2 border-primary" 
              style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB62muIiUcro64wN3fRUdO1c7vCKbYlML21GKFAXu4gRRAVs7wKvKPLvonCdOniM0UQQl0S40KyHrY-IYgkTBFATIZzVlD4WwllWPuRVQhjIplC-c7ih75JNdPllfxWaDVR1g4pK5Ao-RwsxVShhfVlEVVoGJlRAUR3c4-PqYON_JTZSK4fBb50OxWwcWO9WAVAfDyVPSdB27ZfCmYHxCTi-HyxLcsgXtIqd9NdNT3XHgK8HavBXmI2yqPYqIUgFXYGEoaZz93wEJE")` }}
            />
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 w-full max-w-[1440px] mx-auto p-6 gap-8">
        {/* Sidebar */}
        <OrderSidebar 
          user={{
            name: user?.name || 'Jane Doe',
            membership: 'Platinum Member'
          }}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Breadcrumb & Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-text-light dark:text-[#baab9c] text-sm">
              <Link className="hover:text-white transition-colors" href="/">Home</Link>
              <span>/</span>
              <Link className="hover:text-white transition-colors" href="/profile">Account</Link>
              <span>/</span>
              <span className="text-primary">My Orders</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-white tracking-tight">My Orders</h1>
            <p className="text-text-light dark:text-[#baab9c]">Track, return, or buy things again.</p>
          </div>

          {/* Order Status Tabs */}
          <div className="w-full overflow-x-auto border-b border-border-dark dark:border-[#393028]">
            <div className="flex min-w-max gap-8">
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`
                    pb-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                    ${activeTab === tab.value
                      ? 'border-primary text-primary font-bold shadow-[0_1px_0_0_#f27f0d]'
                      : 'border-transparent text-text-light dark:text-[#baab9c] hover:text-white'
                    }
                  `}
                >
                  {tab.label}
                  {tab.count && <span className="ml-1">({tab.count})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Order List */}
          {loading && orders.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-card-dark dark:bg-[#221910] flex items-center justify-center mb-4">
                <MaterialIcon className="text-3xl text-text-light dark:text-[#baab9c]">shopping_bag</MaterialIcon>
              </div>
              <h3 className="text-lg font-bold text-white dark:text-white mb-1">No orders found</h3>
              <p className="text-text-light dark:text-[#baab9c] mb-6">
                {activeTab === 'all' ? "You haven't placed any orders yet." : `No ${activeTab} orders.`}
              </p>
              <Link href="/products" className="px-6 py-2.5 bg-primary hover:bg-primary-700 text-white font-bold rounded-lg transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  showEstimatedDelivery={order.status === 'out_for_delivery'}
                  estimatedDelivery={order.status === 'out_for_delivery' ? 'Arriving Today by 8 PM' : 'Oct 28 - Oct 30'}
                />
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center py-8">
                  <button
                    onClick={() => fetchOrders(page + 1)}
                    disabled={loading}
                    className="flex items-center gap-2 text-text-light dark:text-[#baab9c] hover:text-primary text-sm font-medium transition-colors"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
                    Load more orders
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
