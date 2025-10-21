'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useAnalytics } from '~/common/hooks/useAnalytics';
import { useFilterStore } from '~/common/stores/filterStore';
import { SkeletonLoader } from '~/common/components/ui/Skeleton';
import {
  CONFIG,
  BRANDS,
  PRODUCTS,
  MONTHS,
} from '~/common/constants';
import { formatNumber, getNextMonth, validateDateRange } from '~/common/utils/formatting';

export default function Home() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterModalRef = useRef<HTMLDivElement>(null);

  // Get all state and actions from Zustand store
  const {
    isDropdownOpen,
    isBrandOpen,
    isProductOpen,
    isDateModalOpen,
    selectedBrands,
    selectedProducts,
    startDate,
    endDate,
    currentMonth,
    appliedFilters,
    toggleDropdown,
    closeDropdown,
    toggleBrandSection,
    toggleProductSection,
    openDateModal,
    closeDateModal,
    handleBrandChange,
    handleProductChange,
    removeAppliedFilter,
    deleteAllFilters,
    applyFilters,
    setCurrentMonth,
    applyDateRange,
  } = useFilterStore();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Fetch analytics data using React Query
  const { data: analyticsData, isLoading, isError, error } = useAnalytics(
    appliedFilters.brands,
    appliedFilters.products
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, closeDropdown]);

  // Close filter modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterModalRef.current &&
        !filterModalRef.current.contains(event.target as Node)
      ) {
        setIsFilterModalOpen(false);
      }
    };

    if (isFilterModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterModalOpen]);

  const handleBackToApp = () => {
    window.location.href = CONFIG.APP_URL;
    closeDropdown();
  };

  const handleLogout = () => {
    window.location.href = '/logout';
    closeDropdown();
  };

  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = getNextMonth(currentMonth, direction, MONTHS);
    setCurrentMonth(newMonth);
  };

  const handleApplyDateRange = () => {
    const validation = validateDateRange(startDate, endDate);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }
    applyDateRange();
  };

  return (
    <div className="min-h-screen bg-[#F4F4FF]">
      {/* Header */}
      <header className="bg-white border-b border-grey-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Image 
                  src="/logo.svg" 
                  alt="expeerly logo" 
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </div>
            </div>

            {/* Hamburger Menu with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className={`flex w-10 h-10 p-3 justify-center items-center gap-2.5 rounded-3xl transition-colors border-none cursor-pointer ${
                  isDropdownOpen ? 'bg-navy-300' : 'bg-navy-100 hover:bg-navy-300'
                }`}
              >
                <Image 
                  src="/menu-icon.svg" 
                  alt="Menu" 
                  width={16}
                  height={16}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={handleBackToApp}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-navy-700 cursor-pointer"
                    >
                      <Image 
                        src="/back-button.svg" 
                        alt="Back" 
                        width={19}
                        height={15}
                        className="mr-3"
                      />
                      Back to expeerly app
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-navy-700 cursor-pointer"
                    >
                      <Image 
                        src="/logout-button.svg" 
                        alt="Logout" 
                        width={22}
                        height={22}
                        className="mr-3"
                      />
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
        <h1 className="mb-6 text-navy-700 font-sans text-[30px] font-extrabold leading-[46px]">
          Analytics overview
        </h1>

        {/* Date Range and Filter - Mobile/Tablet View */}
        <div className="lg:hidden mb-4 flex items-center gap-2">
          {/* Date Range Button */}
          <button 
            onClick={openDateModal}
            className="flex-1 flex items-center justify-between px-4 py-3 rounded-lg border border-grey-300 bg-white cursor-pointer"
          >
            <span className="text-navy-700 font-sans text-sm font-normal leading-5">
              Date range
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.7495 9.08365H3.25016V16.6667C3.25016 17.1729 3.66024 17.583 4.1665 17.583H15.8332C16.3394 17.583 16.7495 17.1729 16.7495 16.6667V9.08365ZM12.5828 4.99999V4.08365H7.41683V4.99999C7.41683 5.41421 7.08072 5.75032 6.6665 5.75032C6.25229 5.75032 5.91618 5.41421 5.91618 4.99999V4.08365H4.1665C3.66024 4.08365 3.25016 4.49373 3.25016 4.99999V7.583H16.7495V4.99999C16.7495 4.49373 16.3394 4.08365 15.8332 4.08365H14.0835V4.99999C14.0835 5.41421 13.7474 5.75032 13.3332 5.75032C12.919 5.75032 12.5828 5.41421 12.5828 4.99999ZM18.2502 16.6667C18.2502 18.0013 17.1679 19.0837 15.8332 19.0837H4.1665C2.83182 19.0837 1.74951 18.0013 1.74951 16.6667V4.99999C1.74951 3.66531 2.83182 2.583 4.1665 2.583H5.91618V1.66666C5.91618 1.25245 6.25229 0.916336 6.6665 0.916336C7.08072 0.916336 7.41683 1.25245 7.41683 1.66666V2.583H12.5828V1.66666C12.5828 1.25245 12.919 0.916336 13.3332 0.916336C13.7474 0.916336 14.0835 1.25245 14.0835 1.66666V2.583H15.8332C17.1679 2.583 18.2502 3.66531 18.2502 4.99999V16.6667Z" fill="#080218"/>
            </svg>
          </button>

          {/* Filter Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsFilterModalOpen(!isFilterModalOpen);
            }}
            className="flex w-12 h-12 justify-center items-center rounded-[24px] bg-[#EFEDF4] border-none cursor-pointer hover:bg-[#e0dde8] transition-colors"
          >
            <Image 
              src="/filter-icon.svg" 
              alt="Filter" 
              width={20}
              height={20}
            />
          </button>
        </div>

        {/* Filter Modal - Mobile/Tablet */}
        {isFilterModalOpen && (
          <div ref={filterModalRef} className="lg:hidden mb-4 flex w-full p-4 flex-col items-start gap-4 rounded-xl bg-white relative z-40" onClick={(e) => e.stopPropagation()}>
            {/* Filter by Label */}
            <div className="self-stretch">
              <label className="block text-navy-700 font-sans text-sm font-normal leading-[18px] mb-2">
                Filter by
              </label>

              {/* Brand Dropdown */}
              <div className="mb-2">
                <div 
                  className={`flex px-4 justify-between items-center gap-2.5 self-stretch border-2 border-pink-500 cursor-pointer bg-white relative ${
                    isBrandOpen ? 'rounded-t-lg border-b-0' : 'rounded-lg h-8'
                  }`}
                  onClick={toggleBrandSection}
                >
                  <span className="text-pink-500 font-sans text-sm font-bold leading-5 py-2">
                    Brand
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none"
                    className={`transition-transform duration-200 ${isBrandOpen ? 'rotate-180' : 'rotate-0'}`}
                  >
                    <path d="M4 6L8 10L12 6" stroke="#FA0F9C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Brand Filter Section - Expanded inside border */}
                {isBrandOpen && (
                  <div className="rounded-b-lg border-2 border-t-0 border-pink-500 bg-white p-3">
                    <label className="flex items-center mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.length === BRANDS.length}
                        onChange={() => handleBrandChange('All')}
                        className="mr-2 cursor-pointer accent-pink-500"
                      />
                      <span className="text-navy-700 font-sans text-sm font-normal leading-5">All</span>
                    </label>
                    {BRANDS.map((brand) => (
                      <label key={brand} className="flex items-center mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                          className="mr-2 cursor-pointer accent-pink-500"
                        />
                        <span className="text-navy-700 font-sans text-sm font-normal leading-5">{brand}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Dropdown */}
              <div>
                <div 
                  className={`flex px-4 justify-between items-center gap-2.5 self-stretch border-2 border-pink-500 cursor-pointer bg-white relative ${
                    isProductOpen ? 'rounded-t-lg border-b-0' : 'rounded-lg h-8'
                  }`}
                  onClick={toggleProductSection}
                >
                  <span className="text-pink-500 font-sans text-sm font-bold leading-5 py-2">
                    Product
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none"
                    className={`transition-transform duration-200 ${isProductOpen ? 'rotate-180' : 'rotate-0'}`}
                  >
                    <path d="M4 6L8 10L12 6" stroke="#FA0F9C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Product Filter Section - Expanded inside border */}
                {isProductOpen && (
                  <div className="rounded-b-lg border-2 border-t-0 border-pink-500 bg-white p-3">
                    <label className="flex items-center mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === PRODUCTS.length}
                        onChange={() => handleProductChange('All')}
                        className="mr-2 cursor-pointer accent-pink-500"
                      />
                      <span className="text-navy-700 font-sans text-sm font-normal leading-5">All</span>
                    </label>
                    {PRODUCTS.map((product) => (
                      <label key={product} className="flex items-center mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product)}
                          onChange={() => handleProductChange(product)}
                          className="mr-2 cursor-pointer accent-pink-500"
                        />
                        <span className="text-navy-700 font-sans text-sm font-normal leading-5">{product}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Applied Filters Display */}
            {(selectedBrands.length > 0 || selectedProducts.length > 0) && (
              <div className="flex flex-wrap gap-1.5 self-stretch">
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex items-center px-3 py-1.5 rounded-[56px] text-sm font-normal leading-5 bg-navy-100 border border-navy-300 text-navy-700 gap-2"
                  >
                    {brand}
                    <button
                      onClick={() => removeAppliedFilter('brand', brand)}
                      className="bg-transparent border-none cursor-pointer flex items-center justify-center p-0.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9.90039 2.5L2.40039 10M2.40039 2.50006L9.90039 10" stroke="#080218" strokeWidth="1.25" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </span>
                ))}
                {selectedProducts.map((product) => (
                  <span
                    key={product}
                    className="inline-flex items-center px-3 py-1.5 rounded-[56px] text-sm font-normal leading-5 bg-navy-100 border border-navy-300 text-navy-700 gap-2"
                  >
                    {product}
                    <button
                      onClick={() => removeAppliedFilter('product', product)}
                      className="bg-transparent border-none cursor-pointer flex items-center justify-center p-0.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9.90039 2.5L2.40039 10M2.40039 2.50006L9.90039 10" stroke="#080218" strokeWidth="1.25" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 self-stretch">
              {/* Apply Button */}
              <button
                onClick={() => {
                  applyFilters();
                  setIsFilterModalOpen(false);
                }}
                className={`flex h-12 px-5 justify-center items-center gap-2.5 self-stretch rounded-xl border-none text-center font-sans text-base font-bold leading-normal transition-all duration-200 text-white ${
                  selectedBrands.length + selectedProducts.length === 0
                    ? 'bg-grey-300 cursor-not-allowed'
                    : 'bg-pink-500 cursor-pointer'
                }`}
              >
                Apply{selectedBrands.length + selectedProducts.length > 0 ? ` (${selectedBrands.length + selectedProducts.length})` : ''}
              </button>

              {/* Delete All Button */}
              <button
                onClick={deleteAllFilters}
                className="flex h-12 px-6 justify-center items-center gap-2.5 self-stretch rounded-xl border-2 border-pink-500 bg-white text-pink-500 text-center font-sans text-base font-bold leading-normal cursor-pointer transition-all duration-200"
              >
                Delete all
              </button>
            </div>
          </div>
        )}

        {/* Date Range Modal - Mobile/Tablet */}
        {isDateModalOpen && (
          <div className="lg:hidden mb-4 flex p-4 flex-col items-start gap-4 rounded-xl border border-grey-300 bg-white z-50 shadow-lg">
            {/* Modal Header */}
            <div className="flex justify-between items-center self-stretch">
              <h3 className="text-navy-700 font-sans text-base font-bold leading-5">
                Date range
              </h3>
              <button
                onClick={closeDateModal}
                className="flex w-8 h-8 p-1.5 justify-center items-center gap-2.5 rounded-3xl bg-navy-100 border-none cursor-pointer hover:bg-navy-200 transition-colors"
              >
                <Image 
                  src="/cross.svg" 
                  alt="Close" 
                  width={20}
                  height={20}
                />
              </button>
            </div>

            {/* Month Selection Inputs */}
            <div className="flex items-center gap-2 self-stretch">
              <div className="flex flex-col items-start gap-1 flex-1 px-3 py-2 rounded-lg border border-grey-300">
                <label className="text-navy-700 font-sans text-sm font-normal leading-5">
                  Start date
                </label>
              </div>
              <div className="w-4 h-px bg-grey-300"></div>
              <div className="flex flex-col items-start gap-1 flex-1 px-3 py-2 rounded-lg border border-grey-300">
                <label className="text-navy-400 font-sans text-sm font-normal leading-5">
                  End date
                </label>
              </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between self-stretch">
              <button
                onClick={() => handleNavigateMonth('prev')}
                className="p-1 hover:bg-grey-100 rounded-md transition-colors border-none bg-transparent cursor-pointer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="#080218" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="text-navy-700 text-center font-sans text-base font-bold leading-5">
                {currentMonth}
              </span>
              <button
                onClick={() => handleNavigateMonth('next')}
                className="p-1 hover:bg-grey-100 rounded-md transition-colors border-none bg-transparent cursor-pointer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="#080218" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-start gap-2 self-stretch">
              <button
                onClick={handleApplyDateRange}
                className="flex h-12 px-6 justify-center items-center gap-2.5 flex-1 rounded-xl bg-grey-300 border-none cursor-pointer text-white text-center font-sans text-base font-bold leading-normal hover:bg-grey-500 transition-colors"
              >
                Apply
              </button>
              <button
                onClick={closeDateModal}
                className="flex h-12 px-6 justify-center items-center gap-2.5 flex-1 rounded-xl bg-white border-2 border-grey-300 cursor-pointer text-grey-300 text-center font-sans text-base font-bold leading-normal hover:bg-grey-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
          {/* Left Sidebar - Filters (Desktop only) */}
          <div className="hidden lg:block lg:col-span-1">
            {/* Filter Container with exact specs */}
            <div className="flex w-full p-4 flex-col items-start gap-4 rounded-xl bg-white relative">
              {/* Date Range Container */}
              <div className="rounded-lg border border-grey-300 bg-white flex flex-col items-start gap-1 self-stretch px-4 py-4">
                <div 
                  className="flex items-center justify-between self-stretch cursor-pointer"
                  onClick={openDateModal}
                >
                  <span className="text-navy-700 font-sans text-sm font-normal leading-5">
                    {startDate && endDate ? `${startDate} - ${endDate}` : 'Sept 2025 - Sept 2025'}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.7495 9.08365H3.25016V16.6667C3.25016 17.1729 3.66024 17.583 4.1665 17.583H15.8332C16.3394 17.583 16.7495 17.1729 16.7495 16.6667V9.08365ZM12.5828 4.99999V4.08365H7.41683V4.99999C7.41683 5.41421 7.08072 5.75032 6.6665 5.75032C6.25229 5.75032 5.91618 5.41421 5.91618 4.99999V4.08365H4.1665C3.66024 4.08365 3.25016 4.49373 3.25016 4.99999V7.583H16.7495V4.99999C16.7495 4.49373 16.3394 4.08365 15.8332 4.08365H14.0835V4.99999C14.0835 5.41421 13.7474 5.75032 13.3332 5.75032C12.919 5.75032 12.5828 5.41421 12.5828 4.99999ZM18.2502 16.6667C18.2502 18.0013 17.1679 19.0837 15.8332 19.0837H4.1665C2.83182 19.0837 1.74951 18.0013 1.74951 16.6667V4.99999C1.74951 3.66531 2.83182 2.583 4.1665 2.583H5.91618V1.66666C5.91618 1.25245 6.25229 0.916336 6.6665 0.916336C7.08072 0.916336 7.41683 1.25245 7.41683 1.66666V2.583H12.5828V1.66666C12.5828 1.25245 12.919 0.916336 13.3332 0.916336C13.7474 0.916336 14.0835 1.25245 14.0835 1.66666V2.583H15.8332C17.1679 2.583 18.2502 3.66531 18.2502 4.99999V16.6667Z" fill="#080218"/>
                  </svg>
                </div>
              </div>

              {/* Date Range Popover - Positioned relative to filter container */}
              {isDateModalOpen && (
                <div className="absolute top-[76px] left-4 right-4 flex p-4 flex-col items-start gap-4 rounded-xl border border-grey-300 bg-white z-50 shadow-lg">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center self-stretch">
                    <h3 className="text-navy-700 font-sans text-base font-bold leading-5">
                      Date range
                    </h3>
                    <button
                      onClick={closeDateModal}
                      className="flex w-8 h-8 p-1.5 justify-center items-center gap-2.5 rounded-3xl bg-navy-100 border-none cursor-pointer hover:bg-navy-200 transition-colors"
                    >
                      <Image 
                        src="/cross.svg" 
                        alt="Close" 
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>

                  {/* Month Selection Inputs */}
                  <div className="flex items-center gap-2 self-stretch">
                    <div className="flex flex-col items-start gap-1 flex-1 px-3 py-2 rounded-lg border border-grey-300">
                      <label className="text-navy-700 font-sans text-sm font-normal leading-5">
                        July 2025
                      </label>
                    </div>
                    <div className="w-4 h-px bg-grey-300"></div>
                    <div className="flex flex-col items-start gap-1 flex-1 px-3 py-2 rounded-lg border border-grey-300">
                      <label className="text-navy-400 font-sans text-sm font-normal leading-5">
                        Sept 2025
                      </label>
                    </div>
                  </div>

                  {/* Month Navigation */}
                  <div className="flex items-center justify-between self-stretch">
                    <button
                      onClick={() => handleNavigateMonth('prev')}
                      className="p-1 hover:bg-grey-100 rounded-md transition-colors border-none bg-transparent cursor-pointer"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#080218" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <span className="text-navy-700 text-center font-sans text-base font-bold leading-5">
                      July 2025
                    </span>
                    <button
                      onClick={() => handleNavigateMonth('next')}
                      className="p-1 hover:bg-grey-100 rounded-md transition-colors border-none bg-transparent cursor-pointer"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="#080218" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-start gap-2 self-stretch">
                    <button
                      onClick={handleApplyDateRange}
                      className="flex h-12 px-6 justify-center items-center gap-2.5 flex-1 rounded-xl bg-grey-300 border-none cursor-pointer text-white text-center font-sans text-base font-bold leading-normal hover:bg-grey-500 transition-colors"
                    >
                      Apply
                    </button>
                    <button
                      onClick={closeDateModal}
                      className="flex h-12 px-6 justify-center items-center gap-2.5 flex-1 rounded-xl bg-white border-2 border-grey-300 cursor-pointer text-grey-300 text-center font-sans text-base font-bold leading-normal hover:bg-grey-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Filter by Label */}
              <div className="self-stretch">
                <label className="block text-navy-700 font-sans text-sm font-normal leading-[18px] mb-2">
                  Filter by
                </label>

                {/* Brand Dropdown */}
                <div className="mb-2">
                  <div 
                    className={`flex px-4 justify-between items-center gap-2.5 self-stretch border-2 border-pink-500 cursor-pointer bg-white relative ${
                      isBrandOpen ? 'rounded-t-lg border-b-0' : 'rounded-lg h-8'
                    }`}
                    onClick={toggleBrandSection}
                  >
                    <span className="text-pink-500 font-sans text-sm font-bold leading-5 py-2">
                      Brand
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none"
                      className={`transition-transform duration-200 ${isBrandOpen ? 'rotate-180' : 'rotate-0'}`}
                    >
                      <path d="M4 6L8 10L12 6" stroke="#FA0F9C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Brand Filter Section - Expanded inside border */}
                  {isBrandOpen && (
                    <div className="rounded-b-lg border-2 border-t-0 border-pink-500 bg-white p-3">
                      <label className="flex items-center mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.length === BRANDS.length}
                          onChange={() => handleBrandChange('All')}
                          className="mr-2 cursor-pointer accent-pink-500"
                        />
                        <span className="text-navy-700 font-sans text-sm font-normal leading-5">All</span>
                      </label>
                      {BRANDS.map((brand) => (
                        <label key={brand} className="flex items-center mb-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                            className="mr-2 cursor-pointer accent-pink-500"
                          />
                          <span className="text-navy-700 font-sans text-sm font-normal leading-5">{brand}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Dropdown */}
                <div>
                  <div 
                    className={`flex px-4 justify-between items-center gap-2.5 self-stretch border-2 border-pink-500 cursor-pointer bg-white relative ${
                      isProductOpen ? 'rounded-t-lg border-b-0' : 'rounded-lg h-8'
                    }`}
                    onClick={toggleProductSection}
                  >
                    <span className="text-pink-500 font-sans text-sm font-bold leading-5 py-2">
                      Product
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none"
                      className={`transition-transform duration-200 ${isProductOpen ? 'rotate-180' : 'rotate-0'}`}
                    >
                      <path d="M4 6L8 10L12 6" stroke="#FA0F9C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Product Filter Section - Expanded inside border */}
                  {isProductOpen && (
                    <div className="rounded-b-lg border-2 border-t-0 border-pink-500 bg-white p-3">
                      <label className="flex items-center mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProducts.length === PRODUCTS.length}
                          onChange={() => handleProductChange('All')}
                          className="mr-2 cursor-pointer accent-pink-500"
                        />
                        <span className="text-navy-700 font-sans text-sm font-normal leading-5">All</span>
                      </label>
                      {PRODUCTS.map((product) => (
                        <label key={product} className="flex items-center mb-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product)}
                            onChange={() => handleProductChange(product)}
                            className="mr-2 cursor-pointer accent-pink-500"
                          />
                          <span className="text-navy-700 font-sans text-sm font-normal leading-5">{product}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Applied Filters Display */}
              {(selectedBrands.length > 0 || selectedProducts.length > 0) && (
                <div className="flex flex-wrap gap-1.5 self-stretch">
                  {selectedBrands.map((brand) => (
                    <span
                      key={brand}
                      className="inline-flex items-center px-3 py-1.5 rounded-[56px] text-sm font-normal leading-5 bg-navy-100 border border-navy-300 text-navy-700 gap-2"
                    >
                      {brand}
                      <button
                        onClick={() => removeAppliedFilter('brand', brand)}
                        className="bg-transparent border-none cursor-pointer flex items-center justify-center p-0.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M9.90039 2.5L2.40039 10M2.40039 2.50006L9.90039 10" stroke="#080218" strokeWidth="1.25" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </span>
                  ))}
                  {selectedProducts.map((product) => (
                    <span
                      key={product}
                      className="inline-flex items-center px-3 py-1.5 rounded-[56px] text-sm font-normal leading-5 bg-navy-100 border border-navy-300 text-navy-700 gap-2"
                    >
                      {product}
                      <button
                        onClick={() => removeAppliedFilter('product', product)}
                        className="bg-transparent border-none cursor-pointer flex items-center justify-center p-0.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M9.90039 2.5L2.40039 10M2.40039 2.50006L9.90039 10" stroke="#080218" strokeWidth="1.25" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 self-stretch">
                {/* Apply Button */}
                <button
                  onClick={applyFilters}
                  className={`flex h-12 px-5 justify-center items-center gap-2.5 self-stretch rounded-xl border-none text-center font-sans text-base font-bold leading-normal transition-all duration-200 text-white ${
                    selectedBrands.length + selectedProducts.length === 0
                      ? 'bg-grey-300 cursor-not-allowed'
                      : 'bg-pink-500 cursor-pointer'
                  }`}
                >
                  Apply{selectedBrands.length + selectedProducts.length > 0 ? ` (${selectedBrands.length + selectedProducts.length})` : ''}
                </button>

                {/* Delete All Button */}
                <button
                  onClick={deleteAllFilters}
                  className="flex h-12 px-6 justify-center items-center gap-2.5 self-stretch rounded-xl border-2 border-pink-500 bg-white text-pink-500 text-center font-sans text-base font-bold leading-normal cursor-pointer transition-all duration-200"
                >
                  Delete all
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Analytics Data */}
          <div className="lg:col-span-3 flex flex-col">
            {isLoading ? (
              <SkeletonLoader />
            ) : isError ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center py-8 h-full">
                <p className="text-red-600 font-semibold mb-2">
                  Error loading analytics
                </p>
                <p className="text-gray-600 text-sm">
                  {error instanceof Error
                    ? error.message
                    : 'Failed to fetch data'}
                </p>
              </div>
            ) : analyticsData ? (
              <div className="flex flex-col gap-4 w-full">
                {/* Total Video Views Box */}
                <div className="flex p-[11px] flex-col items-start gap-2 rounded-lg border border-navy-300 bg-white">
                  <h2 className="text-navy-700 font-sans text-xs font-bold leading-4">
                    Total video views
                  </h2>
                  <div className="text-navy-700 font-sans text-lg font-bold leading-[26px]">
                    {formatNumber(analyticsData.totalViews)}
                  </div>
                </div>

                {/* Breakdown by Placement/Traffic Source Box */}
                <div className="rounded-lg border border-navy-300 bg-white p-4 w-full">
                  <h2 className="text-navy-700 font-sans text-xs font-bold leading-4 mb-4">
                    Break down by placement/traffic source
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-left">
                      <div className="text-navy-700 font-sans text-xs font-bold leading-4 mb-2">Retail</div>
                      <div className="text-navy-700 font-sans text-lg font-bold leading-[26px]">
                        {formatNumber(analyticsData.breakdown.retail)}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-navy-700 font-sans text-xs font-bold leading-4 mb-2">Search</div>
                      <div className="text-navy-700 font-sans text-lg font-bold leading-[26px]">
                        {formatNumber(analyticsData.breakdown.search)}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-navy-700 font-sans text-xs font-bold leading-4 mb-2">Social</div>
                      <div className="text-navy-700 font-sans text-lg font-bold leading-[26px]">
                        {formatNumber(analyticsData.breakdown.social)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Placement and Views Table Box */}
                <div className="flex p-[11px] flex-col items-start gap-2 self-stretch rounded-lg border border-navy-300 bg-white">
                  {/* Header Row */}
                  <div className="flex pb-2 items-start self-stretch border-b border-navy-300">
                    <div className="text-navy-700 font-sans text-xs font-bold leading-4" style={{width: '65%'}}>
                      Placement
                    </div>
                    <div className="text-navy-700 font-sans text-xs font-bold leading-4 text-center" style={{width: '35%'}}>
                      Video views
                    </div>
                  </div>

                  {/* Table Content */}
                  {analyticsData.placements.map((section, idx) => (
                    <div key={idx} className="flex flex-col gap-2 self-stretch">
                      {/* Category Header */}
                      <div className="flex items-center self-stretch">
                        <span className="text-navy-700 font-sans text-xs font-bold leading-4" style={{width: '65%'}}>
                          {section.category}
                        </span>
                        <span className="text-navy-700 font-sans text-xs font-bold leading-4 text-center" style={{width: '35%'}}>
                          300
                        </span>
                      </div>

                      {/* Sub-items */}
                      {section.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center self-stretch ml-2">
                          <span className="text-navy-700 font-sans text-xs font-normal leading-4" style={{width: '65%'}}>
                            {item.name}
                          </span>
                          <span className="text-navy-700 font-sans text-xs font-normal leading-4 text-center" style={{width: '35%'}}>
                            300
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Total Views */}
                  <div className="flex items-center self-stretch pt-2 border-t border-navy-300">
                    <span className="text-navy-700 font-sans text-xs font-bold leading-4" style={{width: '65%'}}>
                      Total views:
                    </span>
                    <span className="text-navy-700 font-sans text-xs font-bold leading-4 text-center" style={{width: '35%'}}>
                      300
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
