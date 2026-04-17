/**
 * Shared helper utilities for FundEgypt
 * Providing consistency for data formatting and common logic.
 */

/**
 * Formats a number as EGP (Egyptian Pound)
 */
export const formatCurrency = (amount: number, locale: 'en-EG' | 'ar-EG' = 'en-EG'): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Formats a date relative to local context
 */
export const formatDate = (date: string | Date, locale: 'en-EG' | 'ar-EG' = 'en-EG'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(dateObj);
};

/**
 * A type-safe wrapper for localStorage
 */
export const storage = {
    set: (key: string, value: unknown): void => {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (e) {
            console.error('Error saving to storage:', e);
        }
    },
    get: <T>(key: string): T | null => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from storage:', e);
            return null;
        }
    },
    remove: (key: string): void => {
        localStorage.removeItem(key);
    },
    clear: (): void => {
        localStorage.clear();
    }
};

/**
 * Utility for combining Tailwind class names
 * Filters out falsy values.
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
    return classes.filter(Boolean).join(' ');
};

/**
 * Truncates text to a specified length
 */
export const truncateText = (text: string, length: number): string => {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
};
