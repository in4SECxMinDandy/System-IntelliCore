'use client';

import { useState } from 'react';
import { 
  Star, FileEdit, Brain, Plus, 
  CheckCircle, Send, Image as ImageIcon, Cloud 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StarRating from './StarRating';

interface ReviewFormProps {
  productName: string;
  productImage?: string;
  purchaseDate?: string;
  productVariant?: string;
  onSubmit?: (data: ReviewFormData) => void;
}

export interface ReviewFormData {
  ratings: {
    quality: number;
    delivery: number;
    value: number;
  };
  review: string;
  photos: File[];
  isPublic: boolean;
  termsAccepted: boolean;
}

interface DimensionRating {
  label: string;
  key: keyof ReviewFormData['ratings'];
}

const DIMENSIONS: DimensionRating[] = [
  { label: 'Build Quality', key: 'quality' },
  { label: 'Delivery Speed', key: 'delivery' },
  { label: 'Value for Money', key: 'value' },
];

const SMART_SUGGESTIONS = [
  'sound quality',
  'battery life', 
  'comfort',
  'design',
  'price',
  'shipping',
];

export default function ReviewForm({
  productName,
  productImage,
  purchaseDate,
  productVariant,
  onSubmit
}: ReviewFormProps) {
  const [ratings, setRatings] = useState({ quality: 0, delivery: 0, value: 0 });
  const [review, setReview] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRatingChange = (key: keyof ReviewFormData['ratings'], value: number) => {
    setRatings(prev => ({ ...prev, [key]: value }));
  };

  const getAverageRating = () => {
    const values = Object.values(ratings).filter(v => v > 0);
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  const handleAddSuggestion = (suggestion: string) => {
    setReview(prev => prev ? `${prev} ${suggestion}` : suggestion);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleSubmit = async () => {
    if (getAverageRating() === 0 || !review.trim() || !termsAccepted) return;
    
    setIsSubmitting(true);
    
    const data: ReviewFormData = {
      ratings,
      review,
      photos,
      isPublic,
      termsAccepted,
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit?.(data);
    setIsSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Ratings & Upload */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        {/* Multi-dimensional Rating */}
        <section className="bg-stitch-card rounded-xl p-6 border border-stitch-border shadow-lg">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary-500" />
            Overall Rating
          </h3>
          <div className="space-y-6">
            {DIMENSIONS.map((dim) => (
              <div key={dim.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-stitch-muted font-medium w-32">{dim.label}</label>
                <div className="flex items-center gap-3">
                  <StarRating
                    value={ratings[dim.key]}
                    onChange={(v) => handleRatingChange(dim.key, v)}
                    size="md"
                    showLabel
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Smart Review Assistant */}
        <section className="bg-stitch-card rounded-xl p-6 border border-stitch-border shadow-lg relative group focus-within:ring-1 focus-within:ring-primary-500/50 transition-all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-xl font-bold flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-primary-500" />
              Write your review
            </h3>
            <div className="flex items-center gap-1 bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs border border-green-900/50">
              <CheckCircle className="w-3 h-3" />
              AI Content Guard Active
            </div>
          </div>
          
          <div className="relative">
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              onFocus={() => setIsAnalyzing(true)}
              onBlur={() => setTimeout(() => setIsAnalyzing(false), 2000)}
              className="w-full bg-stitch-bg text-white p-4 rounded-lg border border-stitch-border focus:border-primary-500 focus:ring-0 min-h-[200px] resize-y placeholder:text-stitch-muted"
              placeholder="What did you like or dislike? How was the fit?"
            />
            {/* AI Floating Hints */}
            {isAnalyzing && (
              <div className="absolute bottom-4 right-4 flex gap-2 pointer-events-none">
                <span className="bg-primary-500/10 text-primary-500 text-xs px-2 py-1 rounded-full border border-primary-500/20 backdrop-blur-sm animate-pulse">
                  Analyzing...
                </span>
              </div>
            )}
          </div>

          {/* Smart Suggestions */}
          <div className="mt-4 pt-4 border-t border-stitch-border">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-primary-500" />
              <span className="text-xs text-stitch-muted uppercase tracking-wider font-bold">Smart Suggestions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SMART_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleAddSuggestion(suggestion)}
                  className="text-xs bg-stitch-surface hover:bg-stitch-border text-white px-3 py-1.5 rounded-full border border-stitch-border transition-colors flex items-center gap-1 group/btn"
                >
                  <Plus className="w-3 h-3 text-primary-500 group-hover/btn:scale-110 transition-transform" /> 
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
        <section className="bg-stitch-card rounded-xl p-6 border border-stitch-border shadow-lg h-full flex flex-col">
          <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary-500" />
            Add Photos/Video
          </h3>
          
          <div className="flex-1 border-2 border-dashed border-stitch-border hover:border-primary-500/50 bg-stitch-bg rounded-lg flex flex-col items-center justify-center p-8 text-center transition-colors cursor-pointer group">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
              <div className="bg-stitch-surface p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Cloud className="w-8 h-8 text-stitch-muted group-hover:text-primary-500 transition-colors" />
              </div>
              <p className="text-white font-medium mb-1">Click or drag files here</p>
              <p className="text-xs text-stitch-muted mb-4">Supports JPG, PNG, MP4</p>
              <span className="px-4 py-2 bg-stitch-surface text-white text-xs font-bold rounded hover:bg-stitch-border border border-stitch-border">
                Browse Files
              </span>
            </label>
          </div>

          {/* Preview Thumbnails */}
          {photos.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {photos.map((photo, idx) => (
                <div key={idx} className="aspect-square rounded-lg bg-stitch-border overflow-hidden">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Upload ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Summary & Submit */}
        <section className="bg-gradient-to-br from-stitch-surface to-stitch-card rounded-xl p-6 border border-stitch-border shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <span className="text-stitch-muted text-sm">Review Score</span>
            <span className="text-primary-500 text-2xl font-bold">
              {getAverageRating().toFixed(1)}<span className="text-sm text-stitch-muted font-normal">/5</span>
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-xs text-stitch-muted">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Verified Purchase
            </div>
            <div className="flex items-center gap-2 text-xs text-stitch-muted">
              <Star className="w-3 h-3 text-primary-500" />
              Public Profile
            </div>
          </div>

          <label className="flex items-start gap-3 mb-6 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-stitch-border bg-stitch-bg checked:border-primary-500 checked:bg-primary-500 transition-all"
              />
              <CheckCircle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 text-white pointer-events-none w-3 h-3" />
            </div>
            <span className="text-xs text-stitch-muted group-hover:text-white transition-colors">
              I accept the terms and conditions and certify this review is based on my own experience.
            </span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={getAverageRating() === 0 || !review.trim() || !termsAccepted || isSubmitting}
            className={cn(
              "w-full bg-gradient-to-r from-primary-500 to-orange-600 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2",
              (getAverageRating() === 0 || !review.trim() || !termsAccepted) && "opacity-50 cursor-not-allowed hover:translate-y-0"
            )}
          >
            {isSubmitting ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <>
                Submit Review
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </section>
      </div>
    </div>
  );
}
