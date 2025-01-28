export function convertCheckType(status: string): string {
    const statusMap: { [key: string]: string } = {
        'I': 'AM Arrival',
        'i': 'AM Departure',
        '0': 'PM Arrival',
        'o': 'PM Departure',
        'O': 'PM Departure'
    };

    return status.split('').map(char => statusMap[char] || char).join(', ');
    
}

// // Example usage:
// const input = "Iio0O";
// const output = convertStatus(input);
// console.log(output); // Output: "Check In, Break Out, Check Out, Break In, Check Out"