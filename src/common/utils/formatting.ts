/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted string with thousand separators
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

/**
 * Navigate to previous or next month
 * @param currentMonth - Current month string (e.g., "July 2025")
 * @param direction - Direction to navigate ('prev' or 'next')
 * @param months - Array of month names
 * @returns New month string
 */
export const getNextMonth = (
  currentMonth: string,
  direction: 'prev' | 'next',
  months: string[]
): string => {
  const [month, year] = currentMonth.split(' ');
  const currentIndex = months.indexOf(month!);
  let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

  if (newIndex < 0) {
    newIndex = 11;
    return `${months[newIndex]} ${parseInt(year!) - 1}`;
  } else if (newIndex > 11) {
    newIndex = 0;
    return `${months[newIndex]} ${parseInt(year!) + 1}`;
  } else {
    return `${months[newIndex]} ${year}`;
  }
};

/**
 * Validate date range
 * @param startDate - Start date string
 * @param endDate - End date string
 * @returns Object with isValid flag and error message if invalid
 */
export const validateDateRange = (
  startDate: string,
  endDate: string
): { isValid: boolean; error?: string } => {
  if (!startDate || !endDate) {
    return { isValid: true }; // Allow empty dates
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    return {
      isValid: false,
      error: 'Start date must be before end date',
    };
  }

  return { isValid: true };
};
