'use client';
import React, { use, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { 
  Star, Heart, ShoppingBag, Eye, Sliders, ArrowUpDown, 
  Trash, Search, Check, RefreshCw, X, ChevronRight, Zap
} from 'lucide-react';
import Link from 'next/link';

function CategoryContent({ slug }) {
  const { 
    products, categories, addToCart, toggleWishlist, wishlist, loading, searchQuery 
  } = useApp();

  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';

  // Filter states
  const [innerSearch, setInnerSearch] = useState('');
  const [priceMax, setPriceMax] = useState(2500);
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState('newest');
  const [isEgglessOnly, setIsEgglessOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (urlSearchQuery) {
      setInnerSearch(urlSearchQuery);
    } else if (searchQuery) {
      setInnerSearch(searchQuery);
    }
  }, [urlSearchQuery, searchQuery]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-24 bg-background text-navy gap-3">
        <div className="w-12 h-12 border-t-2 border-b-2 border-orange rounded-full animate-spin"></div>
        <span className="font-sans font-medium animate-pulse uppercase tracking-wider text-xs">Sifting products...</span>
      </div>
    );
  }

  // Identify active category
  const activeCategory = categories.find(c => c.slug === slug);
  
  let title = activeCategory ? activeCategory.name : 'Category Catalog';
  let description = activeCategory?.description || `Specially prepared recipe collections within ${title.toLowerCase()}.`;

  if (slug === 'all') {
    title = 'All Confectioneries';
    description = 'Browse our complete catalog of signature cakes, designer desserts, accessories, and celebratory gift combos.';
  } else if (slug === 'cakes') {
    title = 'All Premium Cakes';
    description = 'Explore our entire collection of artisanal cakes, from designer birthdays to royal weddings and chocolate masterpieces.';
  }

  // Apply filters in-memory
  let filtered = products.filter(p => {
    // Category slug match
    if (slug !== 'all') {
      if (slug === 'cakes') {
        // "All Cakes" special logic: include all subcategories that are cakes
        const isCupcake = p.category === 'cupcakes' || p.name.toLowerCase().includes('cupcake');
        const isPastry = p.category === 'pastries' || p.name.toLowerCase().includes('pastry');
        const isCake = !isCupcake && !isPastry && (p.category?.toLowerCase().includes('cake') || p.name.toLowerCase().includes('cake'));
        if (!isCake) return false;
      } else if (p.category !== slug) {
        // support eggless subcategories check
        if (slug === 'eggless-cakes' && !p.isEgglessOption) return false;
        else if (slug !== 'eggless-cakes') return false;
      }
    }
    
    // Search query match
    if (innerSearch) {
      const q = innerSearch.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTags = p.tags && p.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTags) return false;
    }

    // Price match
    const currentPrice = p.discountPrice || p.price;
    if (currentPrice > priceMax) return false;

    // Rating match
    if (p.rating < minRating) return false;

    // Eggless option check
    if (isEgglessOnly && !p.isEgglessOption) return false;

    return true;
  });

  // Sort logic
  if (sortOption === 'price_asc') {
    filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sortOption === 'price_desc') {
    filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (sortOption === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortOption === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const handleClearFilters = () => {
    setInnerSearch('');
    setPriceMax(2500);
    setMinRating(0);
    setSortOption('newest');
    setIsEgglessOnly(false);
  };

  const handleSimpleAddToCart = (prod) => {
    addToCart(
      prod,
      1,
      prod.weights ? prod.weights[0] : '0.5kg',
      prod.flavors ? prod.flavors[0] : 'Standard Chocolate',
      true, // eggless
      '' // message
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-36 sm:pb-10 space-y-10 bg-background text-foreground">
      
      {/* Category Jumbotron Header */}
      <div className="bg-cream border border-border-color p-8 md:p-12 rounded-[32px] text-center space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange/5 rounded-full blur-2xl animate-pulse"></div>
        <span className="text-[10px] font-medium uppercase tracking-widest text-orange bg-orange/15 px-3 py-1 rounded-full border border-orange/20">Artisanal Bakery</span>
        <h1 className="text-3xl md:text-5xl font-serif font-medium text-navy leading-none">{title}</h1>
        <p className="text-navy/60 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed font-normal">{description}</p>
      </div>

      {/* Mobile Filter Toggle Button */}
      <button 
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        className="lg:hidden w-full bg-orange hover:bg-orange-hover text-white font-medium py-3 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
      >
        <Sliders className="w-4 h-4" />
        <span>{mobileFiltersOpen ? 'Hide Catalog Filters' : 'Show Catalog Filters & Search'}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Col Left: Desktop Filters Panel */}
        <div className={`lg:col-span-1 space-y-6 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-card-bg border border-border-color rounded-[28px] p-6 space-y-6 shadow-md">
            
            <div className="flex justify-between items-center border-b border-border-color pb-3">
              <span className="font-serif font-medium text-base text-navy flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-orange" /> Catalog Filters
              </span>
              <button 
                onClick={handleClearFilters}
                className="text-[10px] font-medium text-red-500 uppercase flex items-center gap-1 hover:text-red-700"
              >
                <X className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>

            {/* Sub-search */}
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-widest text-navy/50">Search Within</label>
              <div className="flex items-center border border-border-color bg-cream/20 rounded-xl py-1.5 px-3">
                <Search className="w-4 h-4 text-navy/40 mr-1.5" />
                <input 
                  type="text" 
                  placeholder="E.g. Truffle, Cupcake"
                  value={innerSearch}
                  onChange={(e) => setInnerSearch(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs text-navy font-medium"
                />
              </div>
            </div>

            {/* Price Max slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-medium uppercase tracking-widest text-navy/50">
                <span>Maximum Price</span>
                <span className="text-orange font-medium text-xs">₹{priceMax}</span>
              </div>
              <input 
                type="range" 
                min={150} 
                max={2500} 
                step={50}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-orange"
              />
              <div className="flex justify-between text-[9px] text-navy/40 font-medium">
                <span>₹150</span>
                <span>₹2500</span>
              </div>
            </div>

            {/* Ratings Filter */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-medium uppercase tracking-widest text-navy/50">Minimum Rating</label>
              <div className="flex flex-col gap-1.5">
                {[0, 4.5, 4.2, 4.0].map((rate) => (
                  <button 
                    key={rate}
                    onClick={() => setMinRating(rate)}
                    className={`flex items-center justify-between text-xs font-medium px-4 py-2 rounded-xl border transition-all text-left ${minRating === rate ? 'bg-orange text-white border-orange shadow-sm animate-pulse-short' : 'border-border-color hover:border-orange bg-background text-navy'}`}
                  >
                    <span>{rate === 0 ? 'All Ratings' : `${rate} Stars & Above`}</span>
                    {rate > 0 && <Star className="w-3.5 h-3.5 fill-gold text-gold shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting filter options */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-medium uppercase tracking-widest text-navy/50 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-orange" /> Sort Results
              </label>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full text-xs font-medium border border-border-color p-2.5 rounded-xl bg-card-bg text-navy outline-none focus:ring-1 focus:ring-orange cursor-pointer"
              >
                <option value="newest">New Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highly Rated</option>
              </select>
            </div>

            {/* Eggless Option ONLY filter checkbox */}
            <label className="flex items-center gap-2 text-xs font-medium text-navy cursor-pointer select-none border-t border-border-color pt-4">
              <input 
                type="checkbox" 
                checked={isEgglessOnly} 
                onChange={(e) => setIsEgglessOnly(e.target.checked)}
                className="accent-orange rounded w-4 h-4"
              />
              <span>Pure Eggless Cakes Only</span>
            </label>

          </div>
        </div>

        {/* Col Right: Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header row stats */}
          <div className="flex justify-between items-center bg-card-bg border border-border-color py-3.5 px-5 rounded-2xl text-xs font-medium text-navy/60 shadow-sm">
            <span>Showing {filtered.length} elegant results matching selections</span>
            <span className="hidden sm:inline text-orange uppercase font-medium tracking-wider">Free Deliveries above ₹499!</span>
          </div>

          {/* Empty state check */}
          {filtered.length === 0 ? (
            <div className="bg-card-bg border border-border-color rounded-[32px] p-16 text-center space-y-4 shadow-sm">
              <div className="text-5xl text-navy/20 animate-bounce">🥣</div>
              <h3 className="font-serif font-medium text-navy text-xl">No Confectioneries Found</h3>
              <p className="text-navy/50 text-xs md:text-sm max-w-sm mx-auto font-normal">We couldn&apos;t locate records matching selections. Try broadening search queries or clearing filters.</p>
              <button 
                onClick={handleClearFilters}
                className="bg-orange hover:bg-orange-hover text-white font-medium py-2.5 px-6 rounded-full text-xs transition-all shadow-md hover:scale-102"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((prod) => {
                const isWishlisted = wishlist.includes(prod._id);
                const isOut = prod.inventory <= 0 || prod.isSoldOut;
                return (
                  <div 
                    key={prod._id}
                    className={`bg-white border border-border-color/50 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden ${isOut ? 'opacity-80' : ''}`}
                  >
                    {/* Top Section: Shorter 4:3 Image & Badges */}
                    <div className="relative rounded-t-2xl overflow-hidden aspect-square border-b border-border-color/20 bg-cream/10">
                      <img 
                        src={prod.images[0]} 
                        alt={prod.name} 
                        className="w-full h-full object-cover"
                      />
                      {isOut && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-[2px]">
                          <span className="text-white font-bold text-[10px] tracking-widest uppercase border border-white px-3 py-1 rounded transform -rotate-12 bg-black/60 shadow-lg shadow-black/50">Sold Out</span>
                        </div>
                      )}
                      {/* Best Seller / Trending badge */}
                      {!isOut && (
                        prod.isPremium ? (
                          <span className="absolute top-2.5 left-2.5 bg-orange text-white font-semibold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow z-10">Premium</span>
                        ) : prod.reviewsCount > 30 ? (
                          <span className="absolute top-2.5 left-2.5 bg-[#e58a13] text-white font-semibold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow z-10">Trending</span>
                        ) : (
                          <span className="absolute top-2.5 left-2.5 bg-orange text-white font-semibold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow z-10">Best Seller</span>
                        )
                      )}
                      
                      {/* Wishlist Button */}
                      <button 
                        onClick={() => toggleWishlist(prod._id)}
                        className="absolute top-2.5 right-2.5 p-1 bg-white/85 hover:bg-white border border-border-color/40 rounded-full text-navy transition-colors z-20 shadow-sm"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-navy/60'}`} />
                      </button>
                    </div>

                    {/* Bottom Section: Compact Product Information & Actions */}
                    <div className="p-3 flex-grow flex flex-col justify-between space-y-2.5">
                      <Link href={`/product/${prod.slug}`} className="space-y-0.5 cursor-pointer block">
                        {/* Rating */}
                        <div className="flex items-center gap-1 text-[8.5px] sm:text-[9px] text-navy/60 font-medium">
                          <Star className="w-2.5 h-2.5 fill-gold text-gold" />
                          <span>{prod.rating} ({prod.reviewsCount} orders)</span>
                        </div>
                        
                        {/* Title */}
                        <h3 className="font-sans font-bold text-navy text-[11px] sm:text-xs leading-snug truncate">{prod.name}</h3>
                      </Link>

                      <div className="space-y-1.5">
                        {/* Price Details */}
                        <div className="flex items-baseline gap-1">
                          <span className={`font-bold text-xs sm:text-sm ${isOut ? 'text-navy/50' : 'text-orange'}`}>₹{prod.discountPrice || prod.price}</span>
                          {prod.discountPrice && (
                            <span className="text-navy/35 line-through text-[9px] sm:text-[10px] font-medium">₹{prod.price}</span>
                          )}
                          <span className="text-navy/40 text-[8px] font-semibold uppercase tracking-wider ml-auto">Per Cake</span>
                        </div>

                        {/* Add to Cart & Buy Now Buttons */}
                        <div className="flex gap-1 pt-1 border-t border-border-color/10">
                          <button 
                            onClick={() => !isOut && handleSimpleAddToCart(prod)}
                            disabled={isOut}
                            className={`flex-1 flex items-center justify-center gap-0.5 py-1 px-0.5 rounded-full border text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider ${isOut ? 'border-navy/10 text-navy/30 cursor-not-allowed bg-cream/10' : 'border-orange text-orange hover:bg-orange/5 bg-white'}`}
                            title="Add to Shopping Cart"
                          >
                            <ShoppingBag className="w-2.5 h-2.5 shrink-0" />
                            <span>Add to Cart</span>
                          </button>

                          <Link
                            href={isOut ? '#' : `/product/${prod.slug}`}
                            className={`flex-1 flex items-center justify-center gap-0.5 py-1 px-0.5 rounded-full text-[8px] sm:text-[9px] font-extrabold text-white uppercase tracking-wider text-center ${isOut ? 'bg-navy/10 text-navy/30 cursor-not-allowed pointer-events-none' : 'bg-green-600 hover:bg-green-700 shadow-sm'}`}
                            title="Buy Cake Now"
                          >
                            <Zap className="w-2.5 h-2.5 shrink-0 fill-white" />
                            <span>Buy Now</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function CategoryPage({ params }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center py-24 bg-background text-navy gap-3">
        <div className="w-12 h-12 border-t-2 border-b-2 border-orange rounded-full animate-spin"></div>
        <span className="font-sans font-medium animate-pulse uppercase tracking-wider text-xs">Cooking Catalog...</span>
      </div>
    }>
      <CategoryContent slug={slug} />
    </Suspense>
  );
}
