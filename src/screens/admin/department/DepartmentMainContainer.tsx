import { useEffect, useState } from 'react';
import DepartmentTable from './department-body/DepartmentTable';

const DepartmentMainContainer = () => {
    const [connectionInfo, setConnectionInfo] = useState<string>('');

    useEffect(() => {
        const connection = (navigator as any).connection;
        
        if (connection) {
            const updateConnectionInfo = () => {
                setConnectionInfo(`${connection.type || 'unknown'} (${connection.effectiveType || 'unknown speed'})`);
            };

            updateConnectionInfo();
            connection.addEventListener('change', updateConnectionInfo);
            
            return () => connection.removeEventListener('change', updateConnectionInfo);
        } else {
            setConnectionInfo('Network information not available');
        }
    }, []);

    return (
        <div className="flex flex-col w-full mt-16 sm:mt-4 overflow-hidden min-h-screen">
            <div className="mb-4 p-2">
                <p>Connection type: {connectionInfo || 'Loading...'}</p>
            </div>
            <DepartmentTable />
        </div>
    );
};

export default DepartmentMainContainer;