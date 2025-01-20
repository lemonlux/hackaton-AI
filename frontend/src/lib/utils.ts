import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getShortText(text : string, maxLength = 230) : string {
  const isLongText = text.length > maxLength;
  const shortText = isLongText ? text.substring(0, maxLength) + "..." : text;
  return shortText;
}
export function normalizeText(text : string) : string {
  const result = text
    .normalize("NFD")
    .trim()
    .replace(/[\u0300-\u036f]/g, "");
  return result;
}