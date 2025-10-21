'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';

interface AnalyticsData {
  totalViews: number;
  breakdown: {
    retail: number;
    search: number;
    social: number;
  };
  placements: Array<{
    category: string;
    items: Array<{ name: string; views: number }>;
  }>;
}

export const useAnalytics = (
  brands: string[],
  products: string[]
): UseQueryResult<AnalyticsData> => {
  return useQuery({
    queryKey: ['analytics', brands, products],
    queryFn: async () => {
      const params = new URLSearchParams();
      brands.forEach(brand => params.append('brands', brand));
      products.forEach(product => params.append('products', product));

      const { data } = await axios.get<AnalyticsData>(
        `/api/analytics?${params.toString()}`
      );
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - analytics data doesn't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

