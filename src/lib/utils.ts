import { clsx, type ClassValue } from "clsx";
import { isValid, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function tryParseDateString(dateStr: string): Date | null {
    // Try different date formats
    const formats = [
        "yyyy-MM-dd", // 2024-10-28
        "MM/dd/yyyy", // 10/28/2024
        "M/d/yyyy", // 10/28/2024 or 1/5/2024
        "MM-dd-yyyy", // 10-28-2024
        "M-d-yyyy", // 10-28-2024 or 1-5-2024
    ];

    for (const formatStr of formats) {
        try {
            const parsedDate = parse(dateStr, formatStr, new Date());
            if (isValid(parsedDate)) {
                return parsedDate;
            }
        } catch {
            continue;
        }
    }

    // If none of the formats work, try the native Date parser as fallback
    const fallbackDate = new Date(dateStr);
    if (isValid(fallbackDate)) {
        return fallbackDate;
    }

    return null;
}

export function parseDateString(dateStr: string): Date {
    const parsedDate = tryParseDateString(dateStr);
    if (parsedDate === null) {
        throw new Error(`Invalid date string: ${dateStr}`);
    }

    return parsedDate;
}
