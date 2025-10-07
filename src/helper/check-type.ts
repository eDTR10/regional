export function convertCheckType(status: string): string {
    const statusMap: { [key: string]: string } = {
        'I': 'Time-In',
        'i': 'Break-In',
        '0': 'Break-Out',
        'o': 'Time-Out',
        'O': 'Break-Out'
    };

    return status.split('').map(char => statusMap[char] || char).join(', ');
    
}

// // Example usage:
// const input = "Iio0O";
// const output = convertStatus(input);
// console.log(output); // Output: "Check In, Break Out, Check Out, Break In, Check Out"