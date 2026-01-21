import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, ImageIcon, BarChart3, LogOut } from 'lucide-react';
import CustomerSelector from './CustomerSelector';
import { useStore } from '../store/useStore';

interface SidebarProps {
    onAddCustomer: () => void;
    onLogout: () => void;
}

export default function Sidebar({ onAddCustomer, onLogout }: SidebarProps) {
    const { user } = useStore();

    const navItems = [
        { to: '/tracker', label: 'Tracker', icon: FolderKanban },
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/gallery', label: 'Gallery', icon: ImageIcon },
        { to: '/insights', label: 'Insights', icon: BarChart3 },
    ];

    return (
        <aside className="w-64 bg-gradient-to-b from-purple-700 via-purple-600 to-purple-800 text-white flex flex-col h-screen fixed left-0 top-0">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <FolderKanban className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Accuracy Issues</h1>
                        <p className="text-xs text-purple-200">Tracker</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="px-3 py-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Customer Selector */}
            <div className="flex-1 overflow-y-auto">
                <CustomerSelector onAddCustomer={onAddCustomer} />
            </div>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-white/10">
                {user && (
                    <div className="mb-3">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-purple-200">{user.email}</p>
                        <p className="text-xs text-purple-300 mt-1">Role: {user.role}</p>
                    </div>
                )}
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-purple-100 hover:bg-white/10 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
