export class DateUtils {
  // static formatDate(date: Date, format: string): string {
  //  // Implementation of date formatting
  //  // For example, using date-fns or moment.js
  //  return new Intl.DateTimeFormat('en-IN', { dateStyle: format }).format(date);
  // }

  /**
   * Formats a date to a specified string format.
   *
   * @param date - The date to format.
   * @param options - Formatting options for Intl.DateTimeFormat.
   * @returns A formatted date string.
   */
  static formatDate(
    date: Date | string | number,
    seperator: string = '-',
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }
  ): string {
    const parsedDate = DateUtils.toDate(date); // Convert the input to a Date object
    if (!parsedDate) return ''; // Return an empty string if the date is invalid

    const formattedDate = new Intl.DateTimeFormat('en-IN', options).format(parsedDate); // Use Intl.DateTimeFormat to format the date
    return formattedDate.replace(/[^0-9]/g, seperator);
  // Replace all non-digit characters (like "/" or ".") with custom separator
  }

  // static formatDate(date: Date | string | number, separator: string): string {
  //   const parsedDate = DateUtils.toDate(date); // Convert input to Date object
  //   if (!parsedDate) return ''; // Return empty string if invalid

  //   const day = String(parsedDate.getDate()).padStart(2, '0');
  //   const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  //   const year = parsedDate.getFullYear();

  //   return `${day}${separator}${month}${separator}${year}`; // Format as dd-MM-yyyy
  // }

  /**
   * Converts a string or number to a Date object.
   *
   * @param date - The date to convert, can be a Date, string, or number (timestamp).
   * @returns A Date object or null if invalid.
   */
  static toDate(date: Date | string | number | null): Date | null {
    if (!date) return null; // Handle null or undefined

    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? null : parsedDate; // Check if the date is valid
    }

    if (typeof date === 'number') {
      return new Date(date); // Convert timestamp to Date
    }

    return date instanceof Date ? date : null; // Return the date or null if invalid
  }

  static toUTCDate(dateString: Date | null): Date | null {
    if (!dateString) {
      return null;
    }
    const date = new Date(dateString);

    // Return a Date object with time set to 00:00:00 in UTC (ignoring local time zone)
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  }
}
