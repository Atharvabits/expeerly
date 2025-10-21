export const CONFIG = {
  APP_URL: 'https://app.expeerly.com',
};

export const THEME = {
  PRIMARY_TEXT_COLOR: '#080218',
  ACCENT_COLOR: 'pink-500',
  ACCENT_LIGHT: 'pink-50',
  ACCENT_BORDER: 'pink-300',
};

export const DEFAULT_FILTERS = {
  BRANDS: ['Koenig'],
  PRODUCTS: ['Airfryer'],
};

export const BRANDS = ['Koenig', 'Turmix'];
export const PRODUCTS = ['Airfryer'];

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  GC_TIME: 10 * 60 * 1000, // 10 minutes
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
};
