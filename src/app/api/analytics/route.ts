import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const AnalyticsQuerySchema = z.object({
  brands: z.array(z.string()).default([]),
  products: z.array(z.string()).default([]),
});

// Mock data - replace with real database queries
const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchAnalyticsData(brands: string[], products: string[]) {
  await mockApiDelay(500); // Simulate database query
  
  const filterMultiplier = Math.max(1, (brands.length || 1) * (products.length || 1));
  
  return {
    totalViews: Math.floor(19398123 * filterMultiplier),
    breakdown: {
      retail: Math.floor(123 * filterMultiplier),
      search: Math.floor(123 * filterMultiplier),
      social: Math.floor(123 * filterMultiplier),
    },
    placements: [
      {
        category: 'Retail',
        items: [
          { name: 'Interdiscount (direct expeerly integration)', views: Math.floor(300 * filterMultiplier) },
          { name: 'Ochsner Sport (direct expeerly integration)', views: Math.floor(300 * filterMultiplier) },
          { name: 'Galaxus (Youtube integration)', views: Math.floor(300 * filterMultiplier) },
          { name: 'Digitec (Youtube integration)', views: Math.floor(300 * filterMultiplier) },
          { name: 'Brack (Youtube integration)', views: Math.floor(300 * filterMultiplier) },
        ],
      },
      {
        category: 'Search',
        items: [
          { name: 'Youtube Search', views: Math.floor(300 * filterMultiplier) },
          { name: 'Expeerly.com', views: Math.floor(300 * filterMultiplier) },
        ],
      },
      {
        category: 'Social',
        items: [
          { name: 'Youtube Social (All traffic that is not retail nor search)', views: Math.floor(300 * filterMultiplier) },
          { name: 'Tiktok', views: Math.floor(300 * filterMultiplier) },
          { name: 'Instagram', views: Math.floor(300 * filterMultiplier) },
          { name: 'Facebook', views: Math.floor(300 * filterMultiplier) },
        ],
      },
    ],
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const brands = searchParams.getAll('brands');
    const products = searchParams.getAll('products');

    // Validate query parameters
    const parsed = AnalyticsQuerySchema.safeParse({ brands, products });
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = await fetchAnalyticsData(parsed.data.brands, parsed.data.products);
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('GET /api/analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

