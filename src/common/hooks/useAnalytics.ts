'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';
import { QUERY_CONFIG } from '../constants';

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
      brands.forEach((brand) => params.append('brands', brand));
      products.forEach((product) => params.append('products', product));

      const { data } = await axios.get<AnalyticsData>(
        `/api/analytics?${params.toString()}`
      );
      return data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.GC_TIME,
    retry: QUERY_CONFIG.RETRY_ATTEMPTS,
    retryDelay: QUERY_CONFIG.RETRY_DELAY,
  });
};

