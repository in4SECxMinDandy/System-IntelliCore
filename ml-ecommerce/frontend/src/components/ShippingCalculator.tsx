// ==========================================
// ShippingCalculator Component (Phase 2.1)
// Calculates shipping fee based on address + weight
// ==========================================

'use client';

import { useState } from 'react';
import { Truck, MapPin, Package, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface ShippingOption {
    carrier: string;
    service: string;
    fee: number;
    estimatedDays: number;
    description: string;
}

interface ShippingCalculatorProps {
    weight?: number; // kg
    productId?: string;
    defaultProvince?: string;
}

const PROVINCES_VN = [
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cần Thơ', 'Cao Bằng', 'Đà Nẵng',
    'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp',
    'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh',
    'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên',
    'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng',
    'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An',
    'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình',
    'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng',
    'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa',
    'Thừa Thiên Huế', 'Tiền Giang', 'TP. Hồ Chí Minh', 'Trà Vinh',
    'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái',
];

// Approximate shipping fee calculation based on province zone
function getShippingOptions(province: string, weight: number = 0.5): ShippingOption[] {
    const isHCM = province === 'TP. Hồ Chí Minh';
    const isHanoi = province === 'Hà Nội';
    const isNearby = ['Bình Dương', 'Đồng Nai', 'Long An', 'Hưng Yên', 'Bắc Ninh', 'Hải Dương'].includes(province);

    const baseFee = isHCM || isHanoi ? 0 : isNearby ? 15000 : 30000;
    const weightFee = weight > 0.5 ? Math.ceil((weight - 0.5) / 0.5) * 5000 : 0;
    const totalFee = baseFee + weightFee;

    const options: ShippingOption[] = [
        {
            carrier: 'Standard',
            service: 'Giao hàng tiêu chuẩn',
            fee: totalFee >= 500000 ? 0 : totalFee, // Free shipping over 500K
            estimatedDays: isHCM || isHanoi ? 1 : isNearby ? 2 : 4,
            description: isHCM || isHanoi ? 'Giao trong ngày' : `Giao trong ${isNearby ? '2-3' : '4-6'} ngày`,
        },
        {
            carrier: 'Express',
            service: 'Giao hàng nhanh',
            fee: totalFee + 20000,
            estimatedDays: isHCM || isHanoi ? 0 : isNearby ? 1 : 2,
            description: isHCM || isHanoi ? 'Giao trong 4 giờ' : isNearby ? 'Giao ngày mai' : 'Giao trong 1-2 ngày',
        },
    ];

    if (!(isHCM || isHanoi)) {
        options.push({
            carrier: 'Economy',
            service: 'Tiết kiệm',
            fee: Math.max(totalFee - 10000, 0),
            estimatedDays: 7,
            description: 'Giao trong 6-8 ngày',
        });
    }

    return options;
}

export default function ShippingCalculator({ weight = 0.5, defaultProvince = '' }: ShippingCalculatorProps) {
    const [province, setProvince] = useState(defaultProvince);
    const [isOpen, setIsOpen] = useState(false);

    const shippingOptions = province ? getShippingOptions(province, weight) : [];
    const freeOption = shippingOptions.find((o) => o.fee === 0);

    return (
        <div className="rounded-xl border border-border/40 bg-muted/20 overflow-hidden">
            <button
                className="w-full flex items-center justify-between p-4 text-sm font-medium hover:bg-muted/40 transition-colors"
                onClick={() => setIsOpen((o) => !o)}
                aria-expanded={isOpen}
                aria-controls="shipping-calculator-content"
            >
                <div className="flex items-center gap-2 text-foreground">
                    <Truck className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span>Tính phí vận chuyển</span>
                    {freeOption && province && (
                        <span className="text-xs text-emerald-500 font-semibold ml-1">
                            Miễn phí!
                        </span>
                    )}
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                />
            </button>

            {isOpen && (
                <div id="shipping-calculator-content" className="p-4 pt-0 space-y-3">
                    {/* Province selector */}
                    <div className="relative">
                        <label htmlFor="shipping-province" className="sr-only">Chọn tỉnh/thành phố</label>
                        <MapPin
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                            aria-hidden="true"
                        />
                        <select
                            id="shipping-province"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                            <option value="">-- Chọn tỉnh/thành phố --</option>
                            {PROVINCES_VN.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    {/* Weight display */}
                    {weight > 0 && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Package className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Khối lượng: {weight}kg</span>
                        </div>
                    )}

                    {/* Options */}
                    {province && shippingOptions.length > 0 && (
                        <div className="space-y-2" role="list" aria-label="Các phương thức vận chuyển">
                            {shippingOptions.map((option) => (
                                <div
                                    key={option.service}
                                    role="listitem"
                                    className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{option.service}</p>
                                        <p className="text-xs text-muted-foreground">{option.description}</p>
                                    </div>
                                    <div className="text-right">
                                        {option.fee === 0 ? (
                                            <span className="text-sm font-semibold text-emerald-500">Miễn phí</span>
                                        ) : (
                                            <span className="text-sm font-semibold text-foreground">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(option.fee)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <p className="text-xs text-muted-foreground text-center pt-1">
                                * Phí vận chuyển chính xác sẽ được tính khi đặt hàng
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
