import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToIST(date: Date | string) {
  // Convert the date to a formatted string in IST
  return date.toLocaleString('en-IN', {
    // timeZone: "Asia/Kolkata", // Indian Standard Time (IST)
    hour12: true, // Use 24-hour format
    weekday: 'short', // Full day of the week (e.g., "Monday")
    year: 'numeric', // Full numeric year (e.g., "2024")
    month: 'short', // Full month name (e.g., "January")
    day: 'numeric', // Day of the month (e.g., "1")
    hour: '2-digit', // Two-digit hour (e.g., "08")
    minute: '2-digit', // Two-digit minute (e.g., "05")
    // second: "2-digit", // Two-digit second (e.g., "03")
  });
}
