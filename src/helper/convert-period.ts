export function convertPerioud(period: number): string {
    switch (period) {
        case 1:
            return 'Whole Day';
        case 2:
            return 'AM';
        case 3:
            return 'PM';
        default:
            return 'Unknown';
    }
}