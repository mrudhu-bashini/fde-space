import { X } from 'lucide-react';
import { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';

interface AddCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
    const [customerName, setCustomerName] = useState('');
    const [loading, setLoading] = useState(false);
    const { setCustomers, customers } = useStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerName.trim()) {
            toast.error('Customer name is required');
            return;
        }

        setLoading(true);
        if (!db) {
            toast.error('Database connection not available (Demo Mode)');
            // Simulate success for demo
            const newCustomer = {
                id: Math.random().toString(36).substr(2, 9),
                name: customerName.trim(),
                createdDate: Date.now(),
                issueCount: 0,
            };
            setCustomers([...customers, newCustomer]);
            toast.success('Customer added (Demo Mode)');
            setCustomerName('');
            onClose();
            setLoading(false);
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'customers'), {
                name: customerName.trim(),
                createdDate: serverTimestamp(),
                issueCount: 0,
            });

            const newCustomer = {
                id: docRef.id,
                name: customerName.trim(),
                createdDate: Date.now(),
                issueCount: 0,
            };

            setCustomers([...customers, newCustomer]);
            toast.success('Customer added successfully');
            setCustomerName('');
            onClose();
        } catch (error) {
            toast.error('Failed to add customer');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Customer</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                            Customer Name
                        </label>
                        <input
                            type="text"
                            id="customerName"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="input"
                            placeholder="Enter customer name"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Customer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
