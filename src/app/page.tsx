'use client';

import { useState, useRef, useEffect } from 'react';
import { useAnalytics } from '~/common/hooks/useAnalytics';

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-12 bg-gray-200 rounded-lg"></div>
    <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  </div>
);

export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Koenig']);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(['Airfryer']);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState('July 2025');
  const [appliedFilters, setAppliedFilters] = useState({ brands: ['Koenig'], products: ['Airfryer'] });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch analytics data using React Query
  const { data: analyticsData, isLoading, isError, error } = useAnalytics(
    appliedFilters.brands,
    appliedFilters.products
  );

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBackToApp = () => {
    window.location.href = 'https://app.expeerly.com';
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    window.location.href = '/logout';
    setIsDropdownOpen(false);
  };

  const toggleBrandSection = () => {
    setIsBrandOpen(!isBrandOpen);
  };

  const toggleProductSection = () => {
    setIsProductOpen(!isProductOpen);
  };

  const handleBrandChange = (brand: string) => {
    if (brand === 'All') {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(prev => 
        prev.includes(brand) 
          ? prev.filter(b => b !== brand)
          : [...prev, brand]
      );
    }
  };

  const handleProductChange = (product: string) => {
    if (product === 'All') {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(prev => 
        prev.includes(product) 
          ? prev.filter(p => p !== product)
          : [...prev, product]
      );
    }
  };

  const removeAppliedFilter = (type: 'brand' | 'product', value: string) => {
    if (type === 'brand') {
      setSelectedBrands(prev => prev.filter(b => b !== value));
    } else {
      setSelectedProducts(prev => prev.filter(p => p !== value));
    }
  };

  const deleteAllFilters = () => {
    setSelectedBrands([]);
    setSelectedProducts([]);
  };

  const applyFilters = async () => {
    setAppliedFilters({
      brands: selectedBrands,
      products: selectedProducts,
    });
  };

  const openDateModal = () => {
    setIsDateModalOpen(true);
  };

  const closeDateModal = () => {
    setIsDateModalOpen(false);
  };

  const applyDateRange = () => {
    console.log('Applying date range:', { startDate, endDate });
    setIsDateModalOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [month, year] = currentMonth.split(' ');
    const currentIndex = months.indexOf(month!);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex < 0) {
      newIndex = 11;
      setCurrentMonth(`${months[newIndex]} ${parseInt(year!) - 1}`);
    } else if (newIndex > 11) {
      newIndex = 0;
      setCurrentMonth(`${months[newIndex]} ${parseInt(year!) + 1}`);
    } else {
      setCurrentMonth(`${months[newIndex]} ${year}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-linear-to-r from-teal-400 via-pink-500 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold" style={{ color: '#080218' }}>expeerly</span>
              </div>
            </div>
            
            {/* Hamburger Menu with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown}
                className="p-2 rounded-full bg-purple-200 hover:bg-purple-300 transition-colors"
              >
                <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={handleBackToApp}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                      style={{ color: '#080218' }}
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to expeerly app
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                      style={{ color: '#080218' }}
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <h1 className="text-3xl font-bold mb-6" style={{ color: '#080218' }}>Analytics overview</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              {/* Date Range */}
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-2" style={{ color: '#080218' }}>Date Range</label>
                <div className="relative z-20">
                  <input
                    type="text"
                    placeholder="Sept 2025 - Sept 2025"
                    onClick={openDateModal}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm"
                    readOnly
                    value={startDate && endDate ? `${startDate} - ${endDate}` : ''}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Date Range Popover */}
                  {isDateModalOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-5 w-80 mr-0">
                      {/* Modal Header */}
                      <div className="flex justify-between items-center mb-5">
                        <h3 className="text-sm font-semibold" style={{ color: '#080218' }}>Date range</h3>
                        <button
                          onClick={closeDateModal}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Date Input Fields */}
                      <div className="mb-5">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium block mb-2" style={{ color: '#080218' }}>Start date</label>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-600"
                              placeholder="Start date"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium block mb-2" style={{ color: '#080218' }}>End date</label>
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-600"
                              placeholder="End date"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Month Navigation */}
                      <div className="flex items-center justify-center mb-5 bg-gray-50 rounded-lg p-3">
                        <button
                          onClick={() => navigateMonth('prev')}
                          className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                        >
                          <svg className="w-5 h-5" style={{ color: '#080218' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span className="mx-4 text-sm font-medium" style={{ color: '#080218' }}>{currentMonth}</span>
                        <button
                          onClick={() => navigateMonth('next')}
                          className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                        >
                          <svg className="w-5 h-5" style={{ color: '#080218' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={applyDateRange}
                          className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-md font-medium text-sm hover:bg-pink-600 transition-colors"
                        >
                          Apply
                        </button>
                        <button
                          onClick={closeDateModal}
                          className="flex-1 bg-white border-2 border-gray-300 text-gray-600 py-2 px-4 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Filter by Label */}
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-3" style={{ color: '#080218' }}>Filter by</label>
                
                {/* Brand Filter Section */}
                <div className="mb-3">
                  <button
                    onClick={toggleBrandSection}
                    className="w-full flex items-center justify-between px-3 py-2 border-2 border-pink-300 rounded-md hover:bg-pink-50 transition-colors text-sm"
                    style={{ color: '#080218' }}
                  >
                    <span className="font-medium">Brand</span>
                    <svg 
                      className={`h-4 w-4 text-pink-500 transition-transform ${isBrandOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isBrandOpen && (
                    <div className="mt-2 space-y-2 pl-2 text-sm">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedBrands.length === 0}
                          onChange={() => handleBrandChange('All')}
                          className="mr-2 text-pink-500 focus:ring-pink-500 rounded"
                        />
                        <span style={{ color: '#080218' }}>All</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes('Koenig')}
                          onChange={() => handleBrandChange('Koenig')}
                          className="mr-2 text-pink-500 focus:ring-pink-500 rounded"
                        />
                        <span style={{ color: '#080218' }}>Koenig</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes('Turmix')}
                          onChange={() => handleBrandChange('Turmix')}
                          className="mr-2 text-pink-500 focus:ring-pink-500 rounded"
                        />
                        <span style={{ color: '#080218' }}>Turmix</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Product Filter Section */}
                <div className="mb-4">
                  <button
                    onClick={toggleProductSection}
                    className="w-full flex items-center justify-between px-3 py-2 border-2 border-pink-300 rounded-md hover:bg-pink-50 transition-colors text-sm"
                    style={{ color: '#080218' }}
                  >
                    <span className="font-medium">Product</span>
                    <svg 
                      className={`h-4 w-4 text-pink-500 transition-transform ${isProductOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isProductOpen && (
                    <div className="mt-2 space-y-2 pl-2 text-sm">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.length === 0}
                          onChange={() => handleProductChange('All')}
                          className="mr-2 text-pink-500 focus:ring-pink-500 rounded"
                        />
                        <span style={{ color: '#080218' }}>All</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes('Airfryer')}
                          onChange={() => handleProductChange('Airfryer')}
                          className="mr-2 text-pink-500 focus:ring-pink-500 rounded"
                        />
                        <span style={{ color: '#080218' }}>Airfryer</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={applyFilters}
                  disabled={isLoading}
                  className="w-full bg-pink-500 text-white py-2 px-4 rounded-md font-semibold text-sm hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  Apply ({selectedBrands.length + selectedProducts.length})
                </button>
                <button
                  onClick={deleteAllFilters}
                  className="w-full bg-white border-2 border-pink-500 py-2 px-4 rounded-md font-medium text-sm hover:bg-pink-50 transition-colors"
                  style={{ color: '#080218' }}
                >
                  Delete all
                </button>
              </div>

              {/* Applied Filters Display */}
              {(selectedBrands.length > 0 || selectedProducts.length > 0) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedBrands.map(brand => (
                    <span
                      key={brand}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100"
                      style={{ color: '#080218' }}
                    >
                      {brand}
                      <button
                        onClick={() => removeAppliedFilter('brand', brand)}
                        className="ml-2 hover:opacity-70"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {selectedProducts.map(product => (
                    <span
                      key={product}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100"
                      style={{ color: '#080218' }}
                    >
                      {product}
                      <button
                        onClick={() => removeAppliedFilter('product', product)}
                        className="ml-2 hover:opacity-70"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Analytics Data */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {isLoading ? (
                <SkeletonLoader />
              ) : isError ? (
                <div className="text-center py-8">
                  <p className="text-red-600 font-semibold mb-2">Error loading analytics</p>
                  <p className="text-gray-600 text-sm">{error instanceof Error ? error.message : 'Failed to fetch data'}</p>
                </div>
              ) : analyticsData ? (
                <>
                  {/* Total Video Views */}
                  <div className="mb-8">
                    <h2 className="text-sm font-medium mb-2" style={{ color: '#080218' }}>Total video views</h2>
                    <div className="text-4xl font-bold" style={{ color: '#080218' }}>{formatNumber(analyticsData.totalViews)}</div>
                  </div>

                  {/* Breakdown by Placement/Traffic Source */}
                  <div className="mb-8">
                    <h2 className="text-sm font-medium mb-4" style={{ color: '#080218' }}>Break down by placement/traffic source</h2>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold" style={{ color: '#080218' }}>{formatNumber(analyticsData.breakdown.retail)}</div>
                        <div className="text-xs" style={{ color: '#080218' }}>Retail</div>
                      </div>
                      <div className="text-center border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold" style={{ color: '#080218' }}>{formatNumber(analyticsData.breakdown.search)}</div>
                        <div className="text-xs" style={{ color: '#080218' }}>Search</div>
                      </div>
                      <div className="text-center border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold" style={{ color: '#080218' }}>{formatNumber(analyticsData.breakdown.social)}</div>
                        <div className="text-xs" style={{ color: '#080218' }}>Social</div>
                      </div>
                    </div>
                  </div>

                  {/* Placement and Views Table */}
                  <div>
                    <h2 className="text-sm font-medium mb-4" style={{ color: '#080218' }}>Placement and Views</h2>
                    <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
                      {analyticsData.placements.map((section: typeof analyticsData.placements[0], idx: number) => (
                        <div key={idx} className={idx !== analyticsData.placements.length - 1 ? 'border-b border-gray-200' : ''}>
                          <div className="font-semibold px-4 py-3 bg-gray-50" style={{ color: '#080218' }}>{section.category}</div>
                          <div className="space-y-0">
                            {section.items.map((item: typeof section.items[0], itemIdx: number) => (
                              <div key={itemIdx} className={`flex justify-between items-center px-4 py-2 text-sm ${itemIdx !== section.items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <span style={{ color: '#080218' }}>{item.name}</span>
                                <span className="font-medium" style={{ color: '#080218' }}>{formatNumber(item.views)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Total Views */}
                      <div className="bg-gray-50 px-4 py-3">
                        <div className="flex justify-between items-center font-semibold text-sm" style={{ color: '#080218' }}>
                          <span>Total views</span>
                          <span>{formatNumber(analyticsData.totalViews)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
