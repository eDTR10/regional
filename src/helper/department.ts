export function getDepartmentName(deptid:any){
        switch (deptid) {
        case 1:
            return 'Regional Office';
        case 2:
            return 'Bukidnon Provincial Office';
        case 3:
            return 'Camiguin Provincial Office';
        case 4:
            return 'Misamis Oriental Provincial Office';
        case 5:
            return 'Misamis Occidental Provincial Office';
        case 6:
            return 'Lanao del Norte Provincial Office';
        default:
            return 'Unknown Department';
        }
    };