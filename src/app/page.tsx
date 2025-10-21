'use client';

import { useState, useEffect, useRef } from 'react';

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBackToApp = () => {
    // Navigate to main expeerly app
    window.location.href = 'https://app.expeerly.com';
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    // Navigate to logout page
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

  const applyFilters = () => {
    console.log('Applying filters:', { selectedBrands, selectedProducts });
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
    // Simple month navigation logic
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [month, year] = currentMonth.split(' ');
    const currentIndex = months.indexOf(month);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex < 0) {
      newIndex = 11;
      setCurrentMonth(`${months[newIndex]} ${parseInt(year) - 1}`);
    } else if (newIndex > 11) {
      newIndex = 0;
      setCurrentMonth(`${months[newIndex]} ${parseInt(year) + 1}`);
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-400 via-pink-500 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold text-black">expeerly</span>
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
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={handleBackToApp}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to expeerly app
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mobile Layout - Single Column */}
          <div className="lg:col-span-1 lg:order-1 order-2">
            <h1 className="text-3xl font-bold text-black mb-6">Analytics overview</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Date Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Date range"
                    onClick={openDateModal}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    readOnly
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Filter by Label */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by</label>
                
                {/* Brand Filter Section */}
                <div className="mb-4">
                  <button
                    onClick={toggleBrandSection}
                    className="w-full flex items-center justify-between px-3 py-2 border-2 border-pink-300 rounded-md hover:bg-pink-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700">Brand</span>
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
                    <div className="mt-2 space-y-2 pl-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedBrands.length === 0}
                          onChange={() => handleBrandChange('All')}
                          className="mr-2 text-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700">All</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes('Koenig')}
                          onChange={() => handleBrandChange('Koenig')}
                          className="mr-2 text-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700">Koenig</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes('Turmix')}
                          onChange={() => handleBrandChange('Turmix')}
                          className="mr-2 text-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700">Turmix</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Product Filter Section */}
                <div className="mb-4">
                  <button
                    onClick={toggleProductSection}
                    className="w-full flex items-center justify-between px-3 py-2 border-2 border-pink-300 rounded-md hover:bg-pink-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700">Product</span>
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
                    <div className="mt-2 space-y-2 pl-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.length === 0}
                          onChange={() => handleProductChange('All')}
                          className="mr-2 text-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700">All</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes('Airfryer')}
                          onChange={() => handleProductChange('Airfryer')}
                          className="mr-2 text-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700">Airfryer</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Applied Filters */}
              {(selectedBrands.length > 0 || selectedProducts.length > 0) && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedBrands.map(brand => (
                      <span
                        key={brand}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {brand}
                        <button
                          onClick={() => removeAppliedFilter('brand', brand)}
                          className="ml-1 hover:text-gray-600"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    {selectedProducts.map(product => (
                      <span
                        key={product}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {product}
                        <button
                          onClick={() => removeAppliedFilter('product', product)}
                          className="ml-1 hover:text-gray-600"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={applyFilters}
                  className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors font-medium"
                >
                  Apply ({selectedBrands.length + selectedProducts.length})
                </button>
                <button
                  onClick={deleteAllFilters}
                  className="w-full bg-white text-pink-500 border-2 border-pink-500 py-2 px-4 rounded-md hover:bg-pink-50 transition-colors font-medium"
                >
                  Delete all
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Analytics Data */}
          <div className="lg:col-span-2 lg:order-2 order-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Total Video Views */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-black mb-2">Total video views</h2>
                <div className="text-4xl font-bold text-black">19'398'123</div>
              </div>

              {/* Breakdown by Placement/Traffic Source */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-black mb-4">Break down by placement/traffic source</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">123</div>
                    <div className="text-sm text-gray-600">Retail</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">123</div>
                    <div className="text-sm text-gray-600">Search</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">123</div>
                    <div className="text-sm text-gray-600">Social</div>
                  </div>
                </div>
              </div>

              {/* Placement and Views Table */}
              <div>
                <h2 className="text-lg font-medium text-black mb-4">Placement and Views</h2>
                <div className="space-y-4">
                  {/* Retail Section */}
                  <div>
                    <div className="font-bold text-black mb-2">Retail</div>
                    <div className="ml-4 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Interdiscount (direct expeerly integration)</span>
                        <span className="font-bold">300</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Ochsner Sport (direct expeerly integration)</span>
                        <span className="font-bold">300</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Galaxus (Youtube integration)</span>
                        <span className="font-bold">300</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Digitec (Youtube integration)</span>
                        <span className="font-bold">300</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Brack (Youtube integration)</span>
                        <span className="font-bold">300</span>
                      </div>
                    </div>
                  </div>

                  {/* Search Section */}
                  <div>
                    <div className="font-bold text-black mb-2">Search</div>
                    <div className="ml-4 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Youtube Search</span>
                        <span className="font-bold">300</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Expeerly.com</span>
                        <span className="font-bold">300</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Section */}
                  <div>
                    <div className="font-bold text-black mb-2">Social</div>
                    <div className="ml-4 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Youtube Social (All traffic that is not retail nor search)</span>
                        <span className="font-bold">300</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tiktok</span>
                        <span className="font-bold">300</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Instagram</span>
                        <span className="font-bold">300</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Facebook</span>
                        <span className="font-bold">300</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Views */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-bold text-black">
                      <span>Total views</span>
                      <span>300</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Date Range Modal */}
      {isDateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Date range</h3>
              <button
                onClick={closeDateModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Date Input Fields */}
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Start date"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="mx-4 text-lg font-medium text-gray-800">{currentMonth}</span>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Apply Button */}
            <button
              onClick={applyDateRange}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
