import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function numToOrdinal(n: number): string {
  const rem10 = n % 10;
  const rem100 = n % 100;

  if (rem10 === 1 && rem100 !== 11) return `${n}st`;
  if (rem10 === 2 && rem100 !== 12) return `${n}nd`;
  if (rem10 === 3 && rem100 !== 13) return `${n}rd`;

  return `${n}th`;
}

export function capitalizeFirst(word: string) {
  if (!word) return "";
  const trimmed = word.trim().split(" ");
  return trimmed.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
