'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, Grid, List, SlidersHorizontal,
  Heart, ShoppingCart, Star, ChevronDown,
  X, Camera, Sparkles, Zap, Tag
} from 'lucide-react';

const mockProducts = [
  { id: 1, name: 'Premium Wireless Headphones', price: 99.99, originalPrice: 149.99, rating: 4.8, reviews: 234, image: null, sale: true },
  { id: 2, name: 'Smart Watch Pro', price: 199.99, rating: 4.9, reviews: 567, image: null },
  { id: 3, name: 'Portable Bluetooth Speaker', price: 49.99, originalPrice: 79.99, rating: 4.6, reviews: 123, image: null, sale: true },
  { id: 4, name: 'Noise Cancelling Earbuds', price: 129.99, rating: 4.7, reviews: 890, image: null },
  { id: 5, name: 'Fitness Tracker Band', price: 39.99, rating: 4.5, reviews: 456, image: null },
  { id: 6, name: 'Smart Home Hub', price: 89.99, originalPrice: 119.99, rating: 4.4, reviews: 78, image: null, sale: true },
  { id: 7, name: 'Wireless Charging Pad', price: 29.99, rating: 4.3, reviews: 234, image: null },
  { id: 8, name: 'Gaming Mouse RGB', price: 59.99, rating: 4.8, reviews: 567, image: null },
];

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Beauty', 'Books', 'Toys'];

export default function VisualSearchPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#181411] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A100A] border-b border-[#4A3021] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#f27f0d] flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-lg font-bold text-white">ML Market</span>
            </Link>
          </div>
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#baab9c]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="w-full bg-[#221910] border border-[#393028] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-[#baab9c] focus:outline-none focus:border-[#f27f0d]"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors relative">
              <ShoppingCart className="w-5 h-5 text-[#baab9c]" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#f27f0d] rounded-full text-xs flex items-center justify-center">3</span>
            </Link>
            <Link href="/wishlist" className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors">
              <Heart className="w-5 h-5 text-[#baab9c]" />
            </Link>
            <Link href="/profile" className="w-8 h-8 rounded-full bg-[#f27f0d] flex items-center justify-center text-sm font-medium">
              U
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Visual Search Hero */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-[#221910] to-[#2D241B] rounded-2xl p-8 border border-[#393028]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#f27f0d]/20 flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#f27f0d]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Visual Search</h1>
                <p className="text-[#baab9c]">Upload an image to find similar products</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-stretch">
              {/* Upload Area */}
              <div className="flex-1">
                {uploadedImage ? (
                  <div className="relative aspect-video bg-[#181411] rounded-xl overflow-hidden">
                    <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-2 right-2 p-1.5 bg-[#181411]/80 rounded-full hover:bg-[#f27f0d] transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="aspect-video border-2 border-dashed border-[#393028] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#f27f0d] transition-colors bg-[#181411]/50">
                    <Camera className="w-12 h-12 text-[#baab9c] mb-3" />
                    <span className="text-[#baab9c]">Drop an image here or click to upload</span>
                    <span className="text-xs text-[#baab9c] mt-1">Supports JPG, PNG, WebP</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
              
              {/* AI Enhancement */}
              <div className="w-64 bg-[#181411] rounded-xl p-4 border border-[#393028]">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#f27f0d]" />
                  <span className="text-sm font-medium text-white">AI Enhancement</span>
                </div>
                <p className="text-xs text-[#baab9c] mb-4">Our AI will analyze your image and find the most similar products automatically.</p>
                <button className="w-full py-2.5 bg-[#f27f0d] text-white rounded-lg font-medium hover:bg-[#d16b08] transition-colors">
                  Search Similar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-[#f27f0d] text-white'
                  : 'bg-[#221910] text-[#baab9c] hover:text-white hover:bg-[#2D241B]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#baab9c]">
            Found <span className="text-white font-medium">247</span> similar products
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#f27f0d] text-white' : 'bg-[#221910] text-[#baab9c]'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#f27f0d] text-white' : 'bg-[#221910] text-[#baab9c]'}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-[#221910] rounded-lg text-[#baab9c] hover:text-white"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm">Filters</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#221910] rounded-lg text-[#baab9c] hover:text-white">
              <span className="text-sm">Sort by: Relevance</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}>
          {mockProducts.map((product) => (
            <div key={product.id} className={`bg-[#221910] rounded-xl overflow-hidden hover:ring-1 hover:ring-[#f27f0d] transition-all cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}>
              <div className={`bg-[#2D241B] ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'}`}>
                {/* Placeholder for product image */}
              </div>
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-white font-medium line-clamp-2">{product.name}</h3>
                  <button className="p-1.5 rounded-lg hover:bg-[#393028] transition-colors">
                    <Heart className="w-4 h-4 text-[#baab9c]" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm text-white">{product.rating}</span>
                  </div>
                  <span className="text-xs text-[#baab9c]">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#f27f0d]">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-[#baab9c] line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  {product.sale && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">SALE</span>
                  )}
                </div>
                <button className="w-full mt-3 py-2 bg-[#393028] text-white rounded-lg text-sm font-medium hover:bg-[#f27f0d] transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-8">
          <button className="px-8 py-3 bg-[#221910] text-white rounded-xl font-medium hover:bg-[#2D241B] transition-colors border border-[#393028]">
            Load More Products
          </button>
        </div>
      </main>
    </div>
  );
}
