import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`;
}

export function generateId(prefix: string = ''): string {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
