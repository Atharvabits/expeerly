import { create } from 'zustand';
import { DEFAULT_FILTERS } from '../constants';

interface FilterState {
  // UI State
  isDropdownOpen: boolean;
  isBrandOpen: boolean;
  isProductOpen: boolean;
  isDateModalOpen: boolean;

  // Filter State
  selectedBrands: string[];
  selectedProducts: string[];
  appliedFilters: {
    brands: string[];
    products: string[];
  };

  // Date State
  startDate: string;
  endDate: string;
  currentMonth: string;

  // Actions - UI
  toggleDropdown: () => void;
  closeDropdown: () => void;
  toggleBrandSection: () => void;
  toggleProductSection: () => void;
  openDateModal: () => void;
  closeDateModal: () => void;

  // Actions - Filters
  handleBrandChange: (brand: string) => void;
  handleProductChange: (product: string) => void;
  removeAppliedFilter: (type: 'brand' | 'product', value: string) => void;
  deleteAllFilters: () => void;
  applyFilters: () => void;

  // Actions - Date
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setCurrentMonth: (month: string) => void;
  applyDateRange: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  // UI State
  isDropdownOpen: false,
  isBrandOpen: true,
  isProductOpen: false,
  isDateModalOpen: false,

  // Filter State
  selectedBrands: DEFAULT_FILTERS.BRANDS,
  selectedProducts: DEFAULT_FILTERS.PRODUCTS,
  appliedFilters: {
    brands: DEFAULT_FILTERS.BRANDS,
    products: DEFAULT_FILTERS.PRODUCTS,
  },

  // Date State
  startDate: '',
  endDate: '',
  currentMonth: 'July 2025',

  // UI Actions
  toggleDropdown: () => set((state) => ({ isDropdownOpen: !state.isDropdownOpen })),
  closeDropdown: () => set({ isDropdownOpen: false }),
  toggleBrandSection: () => set((state) => ({ isBrandOpen: !state.isBrandOpen })),
  toggleProductSection: () => set((state) => ({ isProductOpen: !state.isProductOpen })),
  openDateModal: () => set({ isDateModalOpen: true }),
  closeDateModal: () => set({ isDateModalOpen: false }),

  // Filter Actions
  handleBrandChange: (brand: string) =>
    set((state) => {
      const { BRANDS } = require('../constants');
      if (brand === 'None') {
        return { selectedBrands: [] };
      } else if (brand === 'All') {
        return { selectedBrands: BRANDS };
      } else {
        const isSelected = state.selectedBrands.includes(brand);
        return {
          selectedBrands: isSelected
            ? state.selectedBrands.filter((b) => b !== brand)
            : [...state.selectedBrands, brand],
        };
      }
    }),

  handleProductChange: (product: string) =>
    set((state) => {
      const { PRODUCTS } = require('../constants');
      if (product === 'None') {
        return { selectedProducts: [] };
      } else if (product === 'All') {
        return { selectedProducts: PRODUCTS };
      } else {
        const isSelected = state.selectedProducts.includes(product);
        return {
          selectedProducts: isSelected
            ? state.selectedProducts.filter((p) => p !== product)
            : [...state.selectedProducts, product],
        };
      }
    }),

  removeAppliedFilter: (type: 'brand' | 'product', value: string) =>
    set((state) => ({
      ...(type === 'brand' && {
        selectedBrands: state.selectedBrands.filter((b) => b !== value),
      }),
      ...(type === 'product' && {
        selectedProducts: state.selectedProducts.filter((p) => p !== value),
      }),
    })),

  deleteAllFilters: () =>
    set({
      selectedBrands: [],
      selectedProducts: [],
    }),

  applyFilters: () =>
    set((state) => ({
      appliedFilters: {
        brands: state.selectedBrands,
        products: state.selectedProducts,
      },
    })),

  // Date Actions
  setStartDate: (date: string) => set({ startDate: date }),
  setEndDate: (date: string) => set({ endDate: date }),
  setCurrentMonth: (month: string) => set({ currentMonth: month }),

  applyDateRange: () =>
    set((state) => {
      console.log('Applying date range:', {
        startDate: state.startDate,
        endDate: state.endDate,
      });
      return { isDateModalOpen: false };
    }),
}));
