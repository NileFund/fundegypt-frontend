import { EGYPTIAN_PHONE_REGEX } from './constants'

export function isEgyptianPhone(phone: string): boolean {
  return EGYPTIAN_PHONE_REGEX.test(phone)
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8
}

export function passwordsMatch(password: string, confirm: string): boolean {
  return password === confirm
}

// aliases used by auth pages from main branch
export const validateEmail = isValidEmail

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) return { isValid: false, message: 'Password must be at least 8 characters long.' }
  if (!/[A-Z]/.test(password)) return { isValid: false, message: 'Password must contain at least one uppercase letter.' }
  if (!/[a-z]/.test(password)) return { isValid: false, message: 'Password must contain at least one lowercase letter.' }
  if (!/[0-9]/.test(password)) return { isValid: false, message: 'Password must contain at least one number.' }
  return { isValid: true }
}

export const validateEgyptPhone = (phone: string): boolean => {
  return /^01[0125][0-9]{8}$/.test(phone.replace(/[-\s]/g, ''))
}

export const validateRequired = (value: unknown): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  return true
}
