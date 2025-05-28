export const parseTimeRange = (timeRange: string): number => {
  const unit = timeRange.slice(-1);
  const value = parseInt(timeRange.slice(0, -1));

  switch (unit) {
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    default:
      throw new Error('Formato invalido. Use "3d" o "4h"');
  }
};

export const addTimeToDate = (date: Date, timeRangeMs: number): Date => {
  return new Date(date.getTime() + timeRangeMs);
};

export const addDays = (dateString: string, days: number): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
};
