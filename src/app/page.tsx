'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAnalytics } from '~/common/hooks/useAnalytics';
import { useFilterStore } from '~/common/stores/filterStore';
import { SkeletonLoader } from '~/common/components/ui/Skeleton';
import { Button } from '~/common/components/ui/Button';
import {
  CONFIG,
  THEME,
  BRANDS,
  PRODUCTS,
  MONTHS,
} from '~/common/constants';
import { formatNumber, getNextMonth, validateDateRange } from '~/common/utils/formatting';

export default function Home() {
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    setStartDate,
    setEndDate,
    setCurrentMonth,
    applyDateRange,
  } = useFilterStore();

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
    <div className="min-h-screen" style={{ background: 'var(--Blue-Blue-100, #F4F4FF)' }}>
      {/* Header */}
      <header className="bg-white" style={{ borderBottom: '1px solid #D1D1D4' }}>
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
              <Button
                onClick={toggleDropdown}
                variant="ghost"
                isOnlyIcon
                size="md"
                className="rounded-full! bg-purple-200 hover:bg-purple-300 border-purple-200!"
              >
                <svg
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={handleBackToApp}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                      style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                    >
                      <svg
                        className="w-4 h-4 mr-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Back to expeerly app
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                      style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                    >
                      <svg
                        className="w-4 h-4 mr-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
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
        <div className="grid grid-cols-1 lg:grid-cols-4" style={{ gap: '20px' }}>
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1" style={{ marginRight: '40px' }}>
            <h1 className="mb-6" style={{ color: THEME.PRIMARY_TEXT_COLOR, fontFamily: 'var(--font-mulish)', fontSize: '30px', fontWeight: 800, lineHeight: '46px' }}>
              Analytics overview
            </h1>

            {/* Filter Container with exact specs */}
            <div style={{
              display: 'flex',
              width: '328px',
              padding: '16px',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '16px',
              borderRadius: '12px',
              background: 'var(--White, #FFF)',
            }}>
              {/* Date Range Container */}
              <div style={{
                borderRadius: '8px',
                border: '1px solid var(--Grey-Grey-300, #D1D1D4)',
                background: 'var(--White, #FFF)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '4px',
                alignSelf: 'stretch',
                padding: '12px 16px',
                position: 'relative',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  alignSelf: 'stretch',
                  cursor: 'pointer',
                }}>
                  <span style={{
                    color: 'var(--Navy-Navy-700, #080218)',
                    fontFamily: 'Mulish',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '20px',
                  }}>
                    {startDate && endDate ? `${startDate} - ${endDate}` : 'Sept 2025 - Sept 2025'}
                  </span>
                  <button
                    onClick={openDateModal}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.7495 9.08365H3.25016V16.6667C3.25016 17.1729 3.66024 17.583 4.1665 17.583H15.8332C16.3394 17.583 16.7495 17.1729 16.7495 16.6667V9.08365ZM12.5828 4.99999V4.08365H7.41683V4.99999C7.41683 5.41421 7.08072 5.75032 6.6665 5.75032C6.25229 5.75032 5.91618 5.41421 5.91618 4.99999V4.08365H4.1665C3.66024 4.08365 3.25016 4.49373 3.25016 4.99999V7.583H16.7495V4.99999C16.7495 4.49373 16.3394 4.08365 15.8332 4.08365H14.0835V4.99999C14.0835 5.41421 13.7474 5.75032 13.3332 5.75032C12.919 5.75032 12.5828 5.41421 12.5828 4.99999ZM18.2502 16.6667C18.2502 18.0013 17.1679 19.0837 15.8332 19.0837H4.1665C2.83182 19.0837 1.74951 18.0013 1.74951 16.6667V4.99999C1.74951 3.66531 2.83182 2.583 4.1665 2.583H5.91618V1.66666C5.91618 1.25245 6.25229 0.916336 6.6665 0.916336C7.08072 0.916336 7.41683 1.25245 7.41683 1.66666V2.583H12.5828V1.66666C12.5828 1.25245 12.919 0.916336 13.3332 0.916336C13.7474 0.916336 14.0835 1.25245 14.0835 1.66666V2.583H15.8332C17.1679 2.583 18.2502 3.66531 18.2502 4.99999V16.6667Z" fill="#080218"/>
                    </svg>
                  </button>
                </div>

                {/* Date Range Popover */}
                {isDateModalOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-5 w-80">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center mb-5">
                      <h3
                        className="text-sm font-semibold"
                        style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                      >
                        Date range
                      </h3>
                      <button
                        onClick={closeDateModal}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Date Input Fields */}
                    <div className="mb-5">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label
                            className="text-xs font-medium block mb-2"
                            style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                          >
                            Start date
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="dd-mm-yyyy"
                            style={{
                              colorScheme: 'light',
                              color: '#000000',
                            }}
                          />
                        </div>
                        <div>
                          <label
                            className="text-xs font-medium block mb-2"
                            style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                          >
                            End date
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="dd-mm-yyyy"
                            style={{
                              colorScheme: 'light',
                              color: '#000000',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Month Navigation */}
                    <div className="flex items-center justify-center mb-5 bg-gray-50 rounded-lg p-3">
                      <button
                        onClick={() => handleNavigateMonth('prev')}
                        className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <span
                        className="mx-4 text-sm font-medium"
                        style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                      >
                        {currentMonth}
                      </span>
                      <button
                        onClick={() => handleNavigateMonth('next')}
                        className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleApplyDateRange}
                        variant="primary"
                        size="md"
                        className="flex-1 rounded-md!"
                      >
                        Apply
                      </Button>
                      <Button
                        onClick={closeDateModal}
                        variant="outline"
                        size="md"
                        className="flex-1 rounded-md! border-gray-300! text-gray-600! hover:bg-gray-50!"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Filter by Label */}
              <div style={{ alignSelf: 'stretch' }}>
                <label
                  style={{
                    display: 'block',
                    color: 'var(--Navy-Navy-700, #080218)',
                    fontFamily: 'Mulish',
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '18px',
                    marginBottom: '8px',
                  }}
                >
                  Filter by
                </label>

                {/* Brand Dropdown */}
                <div style={{
                  display: 'flex',
                  height: '32px',
                  padding: '0 16px',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  alignSelf: 'stretch',
                  borderRadius: '8px',
                  border: '2px solid var(--Pink-Pink-500, #FA0F9C)',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  background: '#FFF',
                  position: 'relative',
                }} onClick={toggleBrandSection}>
                  <span style={{
                    color: 'var(--Pink-Pink-500, #FA0F9C)',
                    fontFamily: 'Mulish',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: '20px',
                  }}>
                    Brand
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{
                    transform: isProductOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}>
                    <path d="M4 6L8 10L12 6" stroke="#FA0F9C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Brand Filter Section - Expanded */}
                {isBrandOpen && (
                  <div style={{
                    marginBottom: '8px',
                    borderRadius: '8px',
                    border: '1px solid var(--Grey-Grey-300, #D1D1D4)',
                    background: '#FFF',
                    padding: '8px',
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                      cursor: 'pointer',
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedBrands.length === 0}
                        onChange={() => handleBrandChange('All')}
                        style={{
                          marginRight: '8px',
                          cursor: 'pointer',
                          accentColor: '#FA0F9C',
                        }}
                      />
                      <span style={{
                        color: 'var(--Navy-Navy-700, #080218)',
                        fontFamily: 'Mulish',
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '20px',
                      }}>All</span>
                    </label>
                    {BRANDS.map((brand) => (
                      <label key={brand} style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px',
                        cursor: 'pointer',
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                          style={{
                            marginRight: '8px',
                            cursor: 'pointer',
                            accentColor: '#FA0F9C',
                          }}
                        />
                        <span style={{
                          color: 'var(--Navy-Navy-700, #080218)',
                          fontFamily: 'Mulish',
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '20px',
                        }}>{brand}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Product Dropdown */}
                <div style={{
                  display: 'flex',
                  height: '32px',
                  padding: '0 16px',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  alignSelf: 'stretch',
                  borderRadius: '8px',
                  border: '2px solid var(--Pink-Pink-500, #FA0F9C)',
                  cursor: 'pointer',
                  background: '#FFF',
                }} onClick={toggleProductSection}>
                  <span style={{
                    color: 'var(--Pink-Pink-500, #FA0F9C)',
                    fontFamily: 'Mulish',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: '20px',
                  }}>
                    Product
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{
                    transform: isProductOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}>
                    <path d="M4 6L8 10L12 6" stroke="#FA0F9C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Product Filter Section - Expanded */}
                {isProductOpen && (
                  <div style={{
                    marginTop: '8px',
                    borderRadius: '8px',
                    border: '1px solid var(--Grey-Grey-300, #D1D1D4)',
                    background: '#FFF',
                    padding: '8px',
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                      cursor: 'pointer',
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === 0}
                        onChange={() => handleProductChange('All')}
                        style={{
                          marginRight: '8px',
                          cursor: 'pointer',
                          accentColor: '#FA0F9C',
                        }}
                      />
                      <span style={{
                        color: 'var(--Navy-Navy-700, #080218)',
                        fontFamily: 'Mulish',
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '20px',
                      }}>All</span>
                    </label>
                    {PRODUCTS.map((product) => (
                      <label key={product} style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px',
                        cursor: 'pointer',
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product)}
                          onChange={() => handleProductChange(product)}
                          style={{
                            marginRight: '8px',
                            cursor: 'pointer',
                            accentColor: '#FA0F9C',
                          }}
                        />
                        <span style={{
                          color: 'var(--Navy-Navy-700, #080218)',
                          fontFamily: 'Mulish',
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '20px',
                        }}>{product}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Applied Filters Display */}
              {(selectedBrands.length > 0 || selectedProducts.length > 0) && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  alignSelf: 'stretch',
                }}>
                  {selectedBrands.map((brand) => (
                    <span
                      key={brand}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        paddingLeft: '8px',
                        paddingRight: '4px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 500,
                        background: 'var(--Grey-Grey-300, #D1D1D4)',
                        color: 'var(--Navy-Navy-700, #080218)',
                        gap: '4px',
                      }}
                    >
                      {brand}
                      <button
                        onClick={() => removeAppliedFilter('brand', brand)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '2px',
                        }}
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
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        paddingLeft: '8px',
                        paddingRight: '4px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 500,
                        background: 'var(--Grey-Grey-300, #D1D1D4)',
                        color: 'var(--Navy-Navy-700, #080218)',
                        gap: '4px',
                      }}
                    >
                      {product}
                      <button
                        onClick={() => removeAppliedFilter('product', product)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '2px',
                        }}
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
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignSelf: 'stretch',
              }}>
                {/* Apply Button */}
                <button
                  onClick={applyFilters}
                  disabled={selectedBrands.length === 0 && selectedProducts.length === 0}
                  style={{
                    display: 'flex',
                    height: '48px',
                    padding: selectedBrands.length === 0 && selectedProducts.length === 0 ? '0 24px' : '0 20px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    alignSelf: 'stretch',
                    borderRadius: '12px',
                    border: 'none',
                    background: selectedBrands.length === 0 && selectedProducts.length === 0 ? 'var(--Grey-Grey-300, #D1D1D4)' : 'var(--Pink-Pink-500, #FA0F9C)',
                    color: selectedBrands.length === 0 && selectedProducts.length === 0 ? 'var(--Navy-Navy-700, #080218)' : 'var(--Utility-White, #FFF)',
                    textAlign: 'center',
                    fontFamily: 'Mulish',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: 'normal',
                    cursor: selectedBrands.length === 0 && selectedProducts.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Apply ({selectedBrands.length + selectedProducts.length})
                </button>

                {/* Delete All Button */}
                <button
                  onClick={deleteAllFilters}
                  style={{
                    display: 'flex',
                    height: '48px',
                    padding: '0 24px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    alignSelf: 'stretch',
                    borderRadius: '12px',
                    border: '2px solid var(--Pink-Pink-500, #FA0F9C)',
                    background: 'var(--White, #FFF)',
                    color: 'var(--Pink-Pink-500, #FA0F9C)',
                    textAlign: 'center',
                    fontFamily: 'Mulish',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Delete all
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Analytics Data */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <SkeletonLoader />
            ) : isError ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center py-8">
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
              <div style={{
                borderRadius: '12px',
                background: 'var(--White, #FFF)',
                display: 'flex',
                width: '792px',
                padding: '40px',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                gap: '12px',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                  {/* Total Video Views Box */}
                  <div style={{
                    borderRadius: '8px',
                    border: '1px solid var(--Navy-Navy-300, #B5ABD3)',
                    background: '#FFF',
                    padding: '16px',
                  }}>
                    <h2
                      style={{
                        color: '#080218',
                        fontFamily: 'Mulish',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        lineHeight: '20px',
                        marginBottom: '8px',
                      }}
                    >
                      Total video views
                    </h2>
                    <div
                      style={{
                        color: 'var(--Navy-Navy-700, #080218)',
                        fontFamily: 'Mulish',
                        fontSize: '18px',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        lineHeight: '26px',
                      }}
                    >
                      {formatNumber(analyticsData.totalViews)}
                    </div>
                  </div>

                  {/* Breakdown by Placement/Traffic Source Box */}
                  <div style={{
                    borderRadius: '8px',
                    border: '1px solid var(--Navy-Navy-300, #B5ABD3)',
                    background: '#FFF',
                    padding: '16px',
                  }}>
                  <h2
                    className="text-sm font-medium mb-4"
                    style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                  >
                    Break down by placement/traffic source
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center border border-gray-200 rounded-lg p-4">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                      >
                        {formatNumber(analyticsData.breakdown.retail)}
                      </div>
                      <div style={{ color: THEME.PRIMARY_TEXT_COLOR }}>Retail</div>
                    </div>
                    <div className="text-center border border-gray-200 rounded-lg p-4">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                      >
                        {formatNumber(analyticsData.breakdown.search)}
                      </div>
                      <div style={{ color: THEME.PRIMARY_TEXT_COLOR }}>Search</div>
                    </div>
                    <div className="text-center border border-gray-200 rounded-lg p-4">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                      >
                        {formatNumber(analyticsData.breakdown.social)}
                      </div>
                      <div style={{ color: THEME.PRIMARY_TEXT_COLOR }}>Social</div>
                    </div>
                  </div>
                </div>

                  {/* Placement and Views Table Box */}
                  <div style={{
                    borderRadius: '8px',
                    border: '1px solid var(--Navy-Navy-300, #B5ABD3)',
                    background: '#FFF',
                    padding: '16px',
                  }}>
                    <h2
                      className="text-sm font-medium mb-4"
                      style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                    >
                      Placement and Views
                    </h2>
                    <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
                    {analyticsData.placements.map((section, idx) => (
                      <div
                        key={idx}
                        className={
                          idx !== analyticsData.placements.length - 1
                            ? 'border-b border-gray-200'
                            : ''
                        }
                      >
                        <div
                          className="font-semibold px-4 py-3 bg-gray-50"
                          style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                        >
                          {section.category}
                        </div>
                        <div className="space-y-0">
                          {section.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className={`flex justify-between items-center px-4 py-2 text-sm ${
                                itemIdx !== section.items.length - 1
                                  ? 'border-b border-gray-100'
                                  : ''
                              }`}
                            >
                              <span style={{ color: THEME.PRIMARY_TEXT_COLOR }}>
                                {item.name}
                              </span>
                              <span
                                className="font-medium"
                                style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                              >
                                {formatNumber(item.views)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Total Views */}
                    <div className="bg-gray-50 px-4 py-3">
                      <div
                        className="flex justify-between items-center font-semibold text-sm"
                        style={{ color: THEME.PRIMARY_TEXT_COLOR }}
                      >
                        <span>Total views</span>
                        <span>{formatNumber(analyticsData.totalViews)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
