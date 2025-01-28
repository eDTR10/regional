export function getActivities(activity_id:any) {
    switch (activity_id) {
    case 1:
        return 'In Office';
    case 2:
        return 'Out of Office';
    case 3:
        return 'On Travel';
    case 4:
        return 'On Leave';
    case 5:
        return 'Off Set';
    case 6:
        return 'Holiday';
    default:
        return 'Unknown Status';
    }
};