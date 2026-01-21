import { ChevronRight, FolderOpen, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';

interface CustomerSelectorProps {
    onAddCustomer: () => void;
}

export default function CustomerSelector({ onAddCustomer }: CustomerSelectorProps) {
    const { customers, selectedCustomerId, setSelectedCustomerId } = useStore();

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between px-4 mb-3">
                <h3 className="text-xs font-semibold text-purple-200 uppercase tracking-wider">
                    Customers
                </h3>
                <button
                    onClick={onAddCustomer}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="Add Customer"
                >
                    <Plus className="w-4 h-4 text-purple-200" />
                </button>
            </div>

            <div className="space-y-1">
                {customers.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-purple-300 italic">
                        No customers yet
                    </p>
                ) : (
                    customers.map((customer) => (
                        <button
                            key={customer.id}
                            onClick={() => setSelectedCustomerId(customer.id)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 ${selectedCustomerId === customer.id
                                    ? 'bg-white/20 text-white'
                                    : 'text-purple-100 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <FolderOpen className="w-4 h-4" />
                                <span className="text-sm font-medium">{customer.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                    {customer.issueCount}
                                </span>
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
