export function convertStatus(status: number): string {
    switch (status) {
        case 1:
            return 'In Office';
        case 2:
            return 'Out of Office';
        case 3:
            return 'On Travel';
        case 4:
            return 'On Leave';
        case 5:
            return 'Work from Home';
        case 6:
            return 'Holiday';
        case 7:
            return 'Off Set';
        default:
            return 'Unknown';
    }
}