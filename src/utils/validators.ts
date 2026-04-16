/**
 * Core validation utilities for FundEgypt
 * Shared across the team to ensure consistent validation logic.
 */

/**
 * Validates standard email format
 */
export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * Validates password strength
 * Requires: 8+ chars, 1 uppercase, 1 lowercase, 1 number
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) return { isValid: false, message: "Password must be at least 8 characters long." };
    if (!/[A-Z]/.test(password)) return { isValid: false, message: "Password must contain at least one uppercase letter." };
    if (!/[a-z]/.test(password)) return { isValid: false, message: "Password must contain at least one lowercase letter." };
    if (!/[0-9]/.test(password)) return { isValid: false, message: "Password must contain at least one number." };
    return { isValid: true };
};

/**
 * Validates Egyptian phone numbers
 * Format: 010, 011, 012, 015 followed by 8 digits
 */
export const validateEgyptPhone = (phone: string): boolean => {
    const re = /^01[0125][0-9]{8}$/;
    return re.test(phone.replace(/[-\s]/g, ''));
};

/**
 * Checks if a value is provided and not just whitespace
 */
export const validateRequired = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
};
