'use client';

import { useState } from 'react';

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
        <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                >
                    <svg
                        className={`w-7 h-7 ${star <= (hover || value)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300 dark:text-dark-600'
                            } transition-colors`}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </button>
            ))}
        </div>
    );
}

import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CustomerReviewPage() {
    const router = useRouter();
    // Default mock IDs since this is a standalone demo route. In production this would be pulled from params.
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

    // AI Mock Logic: if it contains bad words, negative sentiment.
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
        <div className="min-h-screen bg-gray-50 dark:bg-[#181411]">
            {/* Main Content */}
            <main className="flex-grow flex justify-center py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col max-w-[1000px] w-full gap-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-gray-200 dark:border-[#393028] pb-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight">
                                Rate &amp; Review Product
                            </h1>
                            <p className="text-gray-500 dark:text-[#baab9c] text-base">
                                Share your experience with the{' '}
                                <span className="text-gray-900 dark:text-white font-medium">
                                    Wireless Noise Cancelling Headphones X5
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-white dark:bg-[#2a221b] p-3 rounded-lg border border-gray-200 dark:border-[#393028] shadow-sm">
                            <div className="size-16 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                                <img
                                    alt="Headphones product image"
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7lUh-lnbbmGbag23sgASctuPVhd0nYrQYTBuFK0TvLWD_gq79a0Z7OftZXm7NnjEOO6q5xgjkVu44G3RTutOwmfTVd45rFY7x7PUfAzyCSIO-1p_Yj0NJA--zP_b-NIreDV-yGTq4PgDOIQK1hyfhqlP1YZy9TQLGLHkTO_8CqDHqL0pc3d7dA8SHF3SX742HA_nbK0FXmZLFMo-MM70oSCWw7x0VIhPYvngGskAVMQ_XNPW8D-OW7ZHq6wN8GDyFn20m6UVZVPA"
                                />
                            </div>
                            <div>
                                <p className="text-gray-900 dark:text-white text-sm font-bold">
                                    Model X5 - Matte Black
                                </p>
                                <p className="text-xs text-gray-500 dark:text-[#baab9c]">
                                    Purchased on Oct 12, 2023
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Ratings & Review */}
                        <div className="lg:col-span-2 flex flex-col gap-8">
                            {/* Multi-dimensional Rating */}
                            <section className="bg-white dark:bg-[#221910] rounded-xl p-6 border border-gray-200 dark:border-[#393028] shadow-sm">
                                <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-6 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    Overall Rating
                                </h3>
                                <div className="space-y-6">
                                    {/* Build Quality */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <label className="text-gray-500 dark:text-[#baab9c] font-medium w-32">
                                            Build Quality
                                        </label>
                                        <StarRating value={buildQuality} onChange={setBuildQuality} />
                                        <span
                                            className={`text-sm font-bold ml-2 ${buildQuality >= 4
                                                ? 'text-primary-600'
                                                : 'text-gray-500 dark:text-[#baab9c]'
                                                }`}
                                        >
                                            {ratingLabels[buildQuality]}
                                        </span>
                                    </div>
                                    {/* Delivery Speed */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <label className="text-gray-500 dark:text-[#baab9c] font-medium w-32">
                                            Delivery Speed
                                        </label>
                                        <StarRating value={deliverySpeed} onChange={setDeliverySpeed} />
                                        <span
                                            className={`text-sm font-bold ml-2 ${deliverySpeed >= 4
                                                ? 'text-primary-600'
                                                : 'text-gray-500 dark:text-[#baab9c]'
                                                }`}
                                        >
                                            {ratingLabels[deliverySpeed]}
                                        </span>
                                    </div>
                                    {/* Value for Money */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <label className="text-gray-500 dark:text-[#baab9c] font-medium w-32">
                                            Value for Money
                                        </label>
                                        <StarRating value={valueForMoney} onChange={setValueForMoney} />
                                        <span
                                            className={`text-sm font-bold ml-2 ${valueForMoney >= 4
                                                ? 'text-primary-600'
                                                : 'text-gray-500 dark:text-[#baab9c]'
                                                }`}
                                        >
                                            {ratingLabels[valueForMoney]}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Smart Review Assistant */}
                            <section className="bg-white dark:bg-[#221910] rounded-xl p-6 border border-gray-200 dark:border-[#393028] shadow-sm relative group focus-within:ring-1 focus-within:ring-primary-500/50 transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-gray-900 dark:text-white text-xl font-bold flex items-center gap-2">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Write your review
                                    </h3>
                                    <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-md text-xs font-medium border border-green-200 dark:border-green-900/50">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        AI Content Guard Active
                                    </div>
                                </div>
                                <div className="relative">
                                    <textarea
                                        className="w-full bg-gray-50 dark:bg-[#181411] text-gray-900 dark:text-slate-100 p-4 rounded-lg border border-gray-200 dark:border-[#393028] focus:border-primary-500 focus:ring-0 min-h-[200px] resize-y placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm"
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
                                            <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs px-2 py-1 rounded-full border border-primary-200 dark:border-primary-800 backdrop-blur-sm animate-pulse">
                                                Analyzing...
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {/* Smart Suggestions */}
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#393028]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                        <span className="text-xs text-gray-500 dark:text-[#baab9c] uppercase tracking-wider font-bold">
                                            Smart Suggestions
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestions.map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                type="button"
                                                onClick={() =>
                                                    setReviewText((prev) =>
                                                        prev ? `${prev} ${suggestion}` : suggestion
                                                    )
                                                }
                                                className="text-xs bg-gray-100 dark:bg-[#2a221b] hover:bg-gray-200 dark:hover:bg-[#393028] text-gray-700 dark:text-white px-3 py-1.5 rounded-full border border-gray-200 dark:border-[#393028] transition-colors flex items-center gap-1"
                                            >
                                                <svg className="w-3.5 h-3.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                                                </svg>
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Media Upload & Summary */}
                        <div className="lg:col-span-1 flex flex-col gap-8">
                            {/* Media Upload */}
                            <section className="bg-white dark:bg-[#221910] rounded-xl p-6 border border-gray-200 dark:border-[#393028] shadow-sm h-full flex flex-col">
                                <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Add Photos/Video
                                </h3>
                                <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-[#393028] hover:border-primary-400 dark:hover:border-primary-600/50 bg-gray-50 dark:bg-[#181411] rounded-lg flex flex-col items-center justify-center p-8 text-center transition-colors cursor-pointer group">
                                    <div className="bg-gray-100 dark:bg-[#2a221b] p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                        <svg
                                            className="w-8 h-8 text-gray-400 dark:text-[#baab9c] group-hover:text-primary-600 transition-colors"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-gray-900 dark:text-white font-medium mb-1">
                                        Click or drag files here
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-[#baab9c] mb-4">
                                        Supports JPG, PNG, MP4
                                    </p>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-100 dark:bg-[#2a221b] text-gray-700 dark:text-white text-xs font-bold rounded hover:bg-gray-200 dark:hover:bg-[#393028] border border-gray-200 dark:border-[#393028] transition-colors"
                                    >
                                        Browse Files
                                    </button>
                                </div>
                            </section>

                            {/* Summary & Submit */}
                            <section className="bg-gradient-to-br from-gray-50 dark:from-[#2a221b] to-white dark:to-[#221910] rounded-xl p-6 border border-gray-200 dark:border-[#393028] shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-500 dark:text-[#baab9c] text-sm">
                                        Review Score
                                    </span>
                                    <span className="text-primary-600 text-2xl font-bold">
                                        {avgScore.toFixed(1)}
                                        <span className="text-sm text-gray-500 dark:text-[#baab9c] font-normal">
                                            /5
                                        </span>
                                    </span>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#baab9c]">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Verified Purchase
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#baab9c]">
                                        <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Public Profile
                                    </div>
                                </div>
                                <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                                    <div className="relative flex items-center mt-0.5">
                                        <input
                                            type="checkbox"
                                            checked={accepted}
                                            onChange={(e) => setAccepted(e.target.checked)}
                                            className="h-4 w-4 cursor-pointer rounded border-gray-300 dark:border-[#393028] bg-white dark:bg-[#181411] text-primary-600 focus:ring-primary-500"
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-[#baab9c] group-hover:text-gray-700 dark:group-hover:text-white transition-colors">
                                        I accept the terms and conditions and certify this review is
                                        based on my own experience.
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => submitReviewMutation.mutate()}
                                    disabled={!accepted || submitReviewMutation.isPending}
                                    className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:to-primary-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-glow-red hover:shadow-glow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                                    {!submitReviewMutation.isPending && (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    )}
                                </button>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
