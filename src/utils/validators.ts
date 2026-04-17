import { EGYPTIAN_PHONE_REGEX } from './constants'

// 01012345678, 01512345678
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

