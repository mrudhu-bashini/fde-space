import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState } from 'react';
import AddCustomerModal from './modals/AddCustomerModal';

export default function Layout() {
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

    const handleLogout = () => {
        console.log('Logout clicked');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar
                onAddCustomer={() => setIsAddCustomerOpen(true)}
                onLogout={handleLogout}
            />

            <main className="flex-1 ml-64 overflow-y-auto">
                <Outlet />
            </main>

            <AddCustomerModal
                isOpen={isAddCustomerOpen}
                onClose={() => setIsAddCustomerOpen(false)}
            />
        </div>
    );
}
