// Path: /Users/julio/Documents/hackrice/HackRice2025/hackrice/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getRiskColor(status: string) {
  switch (status.toLowerCase()) {
    case "good":
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20";
    case "moderate":
    case "caution":
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20";
    case "unhealthy":
    case "avoid":
      return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20";
    case "very_unhealthy":
    case "hazardous":
      return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20";
    default:
      return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/20";
  }
}

export function getRiskIcon(status: string) {
  switch (status.toLowerCase()) {
    case "good":
      return "🌤️";
    case "moderate":
    case "caution":
      return "⚠️";
    case "unhealthy":
    case "avoid":
      return "🚨";
    case "very_unhealthy":
    case "hazardous":
      return "☢️";
    default:
      return "📊";
  }
}