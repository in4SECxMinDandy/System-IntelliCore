'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Material Symbols icon component
const MaterialIcon = ({ icon, className = '', children }: { icon?: string; className?: string; children?: React.ReactNode }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon || children}</span>
);

const ratingLabels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Average',
    4: 'Good',
    5: 'Excellent',
};

function StarRating({
    value,
    onChange,
}: {
    value: number;
    onChange: (v: number) => void;
}) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="hover:scale-110 transition-transform"
                >
                    <MaterialIcon 
                        className={`text-3xl transition-colors ${star <= (hover || value) ? 'text-primary fill-current' : 'text-[#393028]'}`}
                    >
                        star
                    </MaterialIcon>
                </button>
            ))}
        </div>
    );
}

export default function CustomerReviewPage() {
    const router = useRouter();
    const productId = '12345678-1234-1234-1234-123456789012';
    const orderId = '87654321-4321-4321-4321-210987654321';

    const [buildQuality, setBuildQuality] = useState(4);
    const [deliverySpeed, setDeliverySpeed] = useState(5);
    const [valueForMoney, setValueForMoney] = useState(3);
    const [reviewText, setReviewText] = useState('');
    const [accepted, setAccepted] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [suggestions] = useState(['sound quality', 'battery life', 'comfort']);

    const avgScore = ((buildQuality + deliverySpeed + valueForMoney) / 3);

    const computeAI = (text: string) => {
        const lower = text.toLowerCase();
        if (lower.includes('terrible') || lower.includes('bad') || lower.includes('scam')) {
            return { sentiment: 'Negative', fakeProb: 75 };
        }
        if (lower.includes('good') || lower.includes('great') || lower.includes('awesome')) {
            return { sentiment: 'Positive', fakeProb: 5 };
        }
        return { sentiment: 'Neutral', fakeProb: 15 };
    };

    const submitReviewMutation = useMutation({
        mutationFn: async () => {
            const aiData = computeAI(reviewText);
            const res = await api.post('/reviews', {
                productId,
                orderId,
                rating: Math.round(avgScore),
                buildQuality,
                deliverySpeed,
                valueForMoney,
                title: 'Review for Model X5',
                content: reviewText,
                sentiment: aiData.sentiment,
                fakeProb: aiData.fakeProb
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Review submitted successfully!');
            router.push('/');
        },
        onError: () => toast.error('Failed to submit review'),
    });

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Top Navigation */}
            <div className="relative flex w-full flex-col bg-background-dark border-b border-[#393028]">
                <header className="flex items-center justify-between whitespace-nowrap px-10 py-3 max-w-[1400px] mx-auto w-full">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 text-primary">
                            <MaterialIcon className="text-3xl">bolt</MaterialIcon>
                            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">NeonMarket</h2>
                        </div>
                        <div className="hidden md:flex items-center gap-9">
                            <Link className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal" href="/">Home</Link>
                            <Link className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal" href="/products">Products</Link>
                            <Link className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal" href="/orders">Orders</Link>
                            <Link className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">Support</Link>
                        </div>
                    </div>
                    <div className="flex flex-1 justify-end gap-6 items-center">
                        <label className="hidden lg:flex flex-col min-w-40 !h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-[#2a221b] ring-1 ring-[#393028] focus-within:ring-primary">
                                <div className="text-[#baab9c] flex border-none items-center justify-center pl-4 rounded-l-lg border-r-0">
                                    <MaterialIcon>search</MaterialIcon>
                                </div>
                                <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 border-none bg-transparent h-full placeholder:text-[#baab9c] px-4 rounded-l-none pl-2 text-sm font-normal leading-normal" placeholder="Search products..."/>
                            </div>
                        </label>
                        <div className="flex gap-2">
                            <button className="flex items-center justify-center rounded-lg size-10 bg-[#2a221b] text-white hover:text-primary transition-colors">
                                <MaterialIcon>shopping_cart</MaterialIcon>
                            </button>
                            <button className="flex items-center justify-center rounded-lg size-10 bg-[#2a221b] text-white hover:text-primary transition-colors">
                                <MaterialIcon>notifications</MaterialIcon>
                            </button>
                            <button className="flex items-center justify-center rounded-lg size-10 bg-[#2a221b] text-white hover:text-primary transition-colors">
                                <MaterialIcon>account_circle</MaterialIcon>
                            </button>
                        </div>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/50" 
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6Q9shrYtU9gW_FljaAjNMzDrsd9B-y93Ew3gvBSJi4H4PlKZgbAk4RNH7VT-UfDB67W2Wb2V5n14zm5UPvB5lZjWVNXtqPcDAgQhf90iOsKvu4elQgipIMJWOMUne1pV2QMTCyS2fuPUceWj95t6bvPQNtnKFEQbmW6EbJoQCXCnuHsf5Yo2rRVT2XF5QTAjmuChjyOVT97QuN5ZwRSLyfVWgGriKIBLEA3OyokeKGqVzAhGzZQXlz7tNGA1acNU_kE8XabuHq04")' }}
                        />
                    </div>
                </header>
            </div>

            {/* Main Content */}
            <main className="flex-grow flex justify-center py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col max-w-[1000px] w-full gap-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-[#393028] pb-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight">Rate &amp; Review Product</h1>
                            <p className="text-[#baab9c] text-base">Share your experience with the <span className="text-white font-medium">Wireless Noise Cancelling Headphones X5</span></p>
                        </div>
                        <div className="flex items-center gap-4 bg-[#2a221b] p-3 rounded-lg border border-[#393028]">
                            <div className="size-16 rounded overflow-hidden bg-gray-700 shrink-0">
                                <img alt="Headphones product image" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7lUh-lnbbmGbag23sgASctuPVhd0nYrQYTBuFK0TvLWD_gq79a0Z7OftZXm7NnjEOO6q5xgjkVu44G3RTutOwmfTVd45rFY7x7PUfAzyCSIO-1p_Yj0NJA--zP_b-NIreDV-yGTq4PgDOIQK1hyfhqlP1YZy9TQLGLHkTO_8CqDHqL0pc3d7dA8SHF3SX742HA_nbK0FXmZLFMo-MM70oSCWw7x0VIhPYvngGskAVMQ_XNPW8D-OW7ZHq6wN8GDyFn20m6UVZVPA"/>
                            </div>
                            <div>
                                <p className="text-white text-sm font-bold">Model X5 - Matte Black</p>
                                <p className="text-xs text-[#baab9c]">Purchased on Oct 12, 2023</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Ratings & Upload */}
                        <div className="lg:col-span-2 flex flex-col gap-8">
                            {/* Multi-dimensional Rating */}
                            <section className="bg-card-dark rounded-xl p-6 border border-[#393028] shadow-lg">
                                <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                                    <MaterialIcon className="text-primary">stars</MaterialIcon>
                                    Overall Rating
                                </h3>
                                <div className="space-y-6">
                                    {/* Quality */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <label className="text-[#baab9c] font-medium w-32">Build Quality</label>
                                        <div className="flex gap-2">
                                            <StarRating value={buildQuality} onChange={setBuildQuality} />
                                        </div>
                                        <span className={`text-sm font-bold ml-2 ${buildQuality >= 4 ? 'text-primary' : 'text-[#baab9c]'}`}>
                                            {ratingLabels[buildQuality]}
                                        </span>
                                    </div>
                                    {/* Delivery */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <label className="text-[#baab9c] font-medium w-32">Delivery Speed</label>
                                        <div className="flex gap-2">
                                            <StarRating value={deliverySpeed} onChange={setDeliverySpeed} />
                                        </div>
                                        <span className={`text-sm font-bold ml-2 ${deliverySpeed >= 4 ? 'text-primary' : 'text-[#baab9c]'}`}>
                                            {ratingLabels[deliverySpeed]}
                                        </span>
                                    </div>
                                    {/* Value */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <label className="text-[#baab9c] font-medium w-32">Value for Money</label>
                                        <div className="flex gap-2">
                                            <StarRating value={valueForMoney} onChange={setValueForMoney} />
                                        </div>
                                        <span className={`text-sm font-bold ml-2 ${valueForMoney >= 4 ? 'text-primary' : 'text-[#baab9c]'}`}>
                                            {ratingLabels[valueForMoney]}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Smart Review Assistant */}
                            <section className="bg-card-dark rounded-xl p-6 border border-[#393028] shadow-lg relative group focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-white text-xl font-bold flex items-center gap-2">
                                        <MaterialIcon className="text-primary">edit_note</MaterialIcon>
                                        Write your review
                                    </h3>
                                    <div className="flex items-center gap-1 bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs border border-green-900/50">
                                        <MaterialIcon className="text-sm">check_circle</MaterialIcon>
                                        AI Content Guard Active
                                    </div>
                                </div>
                                <div className="relative">
                                    <textarea 
                                        className="w-full bg-[#181411] text-slate-100 p-4 rounded-lg border border-[#393028] focus:border-primary focus:ring-0 min-h-[200px] resize-y placeholder:text-gray-600" 
                                        placeholder="What did you like or dislike? How was the fit?"
                                        value={reviewText}
                                        onChange={(e) => {
                                            setReviewText(e.target.value);
                                            setIsAnalyzing(e.target.value.length > 0);
                                        }}
                                    />
                                    {/* AI Floating Hints */}
                                    {isAnalyzing && reviewText.length > 0 && (
                                        <div className="absolute bottom-4 right-4 flex gap-2 pointer-events-none">
                                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full border border-primary/20 backdrop-blur-sm animate-pulse">Analyzing...</span>
                                        </div>
                                    )}
                                </div>
                                {/* Smart Suggestions */}
                                <div className="mt-4 pt-4 border-t border-[#393028]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MaterialIcon className="text-primary text-sm">psychology</MaterialIcon>
                                        <span className="text-xs text-[#baab9c] uppercase tracking-wider font-bold">Smart Suggestions</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestions.map((suggestion) => (
                                            <button 
                                                key={suggestion}
                                                onClick={() => setReviewText((prev) => prev ? `${prev} ${suggestion}` : suggestion)}
                                                className="text-xs bg-[#2a221b] hover:bg-[#393028] text-white px-3 py-1.5 rounded-full border border-[#393028] transition-colors flex items-center gap-1 group/btn"
                                            >
                                                <MaterialIcon className="text-[14px] text-primary">add</MaterialIcon> {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Media Upload & Summary */}
                        <div className="lg:col-span-1 flex flex-col gap-8">
                            {/* Media Upload */}
                            <section className="bg-card-dark rounded-xl p-6 border border-[#393028] shadow-lg h-full flex flex-col">
                                <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                                    <MaterialIcon className="text-primary">photo_camera</MaterialIcon>
                                    Add Photos/Video
                                </h3>
                                <div className="flex-1 border-2 border-dashed border-[#393028] hover:border-primary/50 bg-[#181411] rounded-lg flex flex-col items-center justify-center p-8 text-center transition-colors cursor-pointer group">
                                    <div className="bg-[#2a221b] p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                        <MaterialIcon className="text-3xl text-[#baab9c] group-hover:text-primary transition-colors">cloud_upload</MaterialIcon>
                                    </div>
                                    <p className="text-white font-medium mb-1">Click or drag files here</p>
                                    <p className="text-xs text-[#baab9c] mb-4">Supports JPG, PNG, MP4</p>
                                    <button className="px-4 py-2 bg-[#2a221b] text-white text-xs font-bold rounded hover:bg-[#393028] border border-[#393028]">Browse Files</button>
                                </div>
                            </section>

                            {/* Summary & Submit */}
                            <section className="bg-gradient-to-br from-[#2a221b] to-card-dark rounded-xl p-6 border border-[#393028] shadow-lg">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[#baab9c] text-sm">Review Score</span>
                                    <span className="text-primary text-2xl font-bold">{avgScore.toFixed(1)}<span className="text-sm text-[#baab9c] font-normal">/5</span></span>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-xs text-[#baab9c]">
                                        <MaterialIcon className="text-sm text-green-500">check</MaterialIcon>
                                        Verified Purchase
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#baab9c]">
                                        <MaterialIcon className="text-sm text-primary">visibility</MaterialIcon>
                                        Public Profile
                                    </div>
                                </div>
                                <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input 
                                            type="checkbox" 
                                            checked={accepted}
                                            onChange={(e) => setAccepted(e.target.checked)}
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#393028] bg-[#181411] checked:border-primary checked:bg-primary transition-all"
                                        />
                                        <MaterialIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 text-white pointer-events-none text-sm">check</MaterialIcon>
                                    </div>
                                    <span className="text-xs text-[#baab9c] group-hover:text-white transition-colors">I accept the terms and conditions and certify this review is based on my own experience.</span>
                                </label>
                                <button 
                                    onClick={() => submitReviewMutation.mutate()}
                                    disabled={!accepted || submitReviewMutation.isPending}
                                    className="w-full bg-gradient-to-r from-primary to-orange-600 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-[0_0_20px_rgba(242,127,13,0.3)] hover:shadow-[0_0_30px_rgba(242,127,13,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                                    <MaterialIcon>send</MaterialIcon>
                                </button>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Simple */}
            <footer className="border-t border-[#393028] bg-background-dark py-8 mt-10">
                <div className="max-w-[1400px] mx-auto px-10 text-center text-[#baab9c] text-sm">
                    <p>© 2023 NeonMarket. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
