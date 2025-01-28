export function convertDate(dateString: string) {
    const date = new Date(dateString);

    // ISO format
    const isoFormat = date.toISOString();

    // Locale date and time format
    const localeDateTimeFormat = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'UTC'
    }).format(date);

    // Locale date format
    const localeDateFormat = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC'
    }).format(date);

    // Locale time format
    const localeTimeFormat = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
    }).format(date);

    // Custom format: YYYY-MM-DD
    const customFormat = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;

    // 12-hour format with AM/PM
    const localeTime12HourFormat = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
    }).format(date);

    // Custom format: January 4, 2001
    const customLongDateFormat = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    }).format(date);

    // Custom format: dd/mm/yyyy
    const customDDMMYYYYFormat = `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`;

    return {
        isoFormat,
        localeDateTimeFormat,
        localeDateFormat,
        localeTimeFormat,
        customFormat,
        localeTime12HourFormat,
        customLongDateFormat,
        customDDMMYYYYFormat
    };
}

// Example output:
// {
//     "isoFormat": "2024-10-14T08:05:09.000Z",
//     "localeDateTimeFormat": "10/14/2024, 08:05:09",
//     "localeDateFormat": "10/14/2024",
//     "localeTimeFormat": "08:05:09",
//     "customFormat": "2024-10-14",
//     "localeTime12HourFormat": "08:05 AM",
//     "customLongDateFormat": "October 14, 2024",
//     "customDDMMYYYYFormat": "14/10/2024"
// }