import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { intervalToDuration } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const secToHM = (secs: number): string => {
  const { hours, minutes } = intervalToDuration({
    start: 0,
    end: secs * 1000,
  });

  return `${hours ?? 0}h ${minutes ?? 0}m`;
};
