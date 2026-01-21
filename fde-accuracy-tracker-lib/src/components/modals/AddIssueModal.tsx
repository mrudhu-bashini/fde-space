import { X, Upload } from 'lucide-react';
import { useState } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';
import type { Issue, Screenshot } from '../../types';

interface AddIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddIssueModal({ isOpen, onClose }: AddIssueModalProps) {
    const { selectedCustomerId, customers, user, issues, setIssues } = useStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        status: 'Open' as const,
        model: '',
        workflow: '',
        executionLogLink: '',
        issueSummary: '',
        fix: '',
    });
    const [screenshots, setScreenshots] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setScreenshots(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCustomerId) {
            toast.error('Please select a customer first');
            return;
        }

        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        setLoading(true);
        if (!db || !storage) {
            toast.error('Backend services not available (Demo Mode)');
            // Simulate success for demo
            const demoScreenshots: Screenshot[] = screenshots.map(file => ({
                id: crypto.randomUUID(),
                url: URL.createObjectURL(file), // Use local blob URL for demo
                description: file.name,
                dateAdded: Date.now(),
            }));

            const customer = customers.find(c => c.id === selectedCustomerId);

            const newIssue: Issue = {
                id: crypto.randomUUID(),
                customerId: selectedCustomerId,
                customerName: customer?.name || '',
                title: formData.title.trim(),
                category: formData.category.trim(),
                status: formData.status,
                model: formData.model.trim(),
                workflow: formData.workflow.trim(),
                executionLogLink: formData.executionLogLink.trim(),
                screenshots: demoScreenshots,
                issueSummary: formData.issueSummary.trim(),
                fix: formData.fix.trim(),
                dateAdded: Date.now(),
                lastUpdated: Date.now(),
                reportedBy: user?.name || user?.email || 'Demo User',
            };

            setIssues([...issues, newIssue]);

            // Also need to update issue count in local state if we want real demo feel
            toast.success('Issue added (Demo Mode)');
            resetForm();
            onClose();
            setLoading(false);
            return;
        }

        try {
            // Upload screenshots
            const uploadedScreenshots: Screenshot[] = [];
            for (const file of screenshots) {
                const storageRef = ref(storage!, `screenshots/${selectedCustomerId}/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                uploadedScreenshots.push({
                    id: crypto.randomUUID(),
                    url,
                    description: file.name,
                    dateAdded: Date.now(),
                });
            }

            const customer = customers.find(c => c.id === selectedCustomerId);

            const issueData = {
                customerId: selectedCustomerId,
                customerName: customer?.name || '',
                title: formData.title.trim(),
                category: formData.category.trim(),
                status: formData.status,
                model: formData.model.trim(),
                workflow: formData.workflow.trim(),
                executionLogLink: formData.executionLogLink.trim(),
                screenshots: uploadedScreenshots,
                issueSummary: formData.issueSummary.trim(),
                fix: formData.fix.trim(),
                dateAdded: serverTimestamp(),
                lastUpdated: serverTimestamp(),
                reportedBy: user?.name || user?.email || 'Unknown',
            };

            const docRef = await addDoc(collection(db!, 'issues'), issueData);

            // Update customer issue count
            await updateDoc(doc(db!, 'customers', selectedCustomerId), {
                issueCount: increment(1)
            });

            const newIssue: Issue = {
                id: docRef.id,
                ...issueData,
                dateAdded: Date.now(),
                lastUpdated: Date.now(),
                screenshots: uploadedScreenshots,
            };

            setIssues([...issues, newIssue]);

            toast.success('Issue added successfully');
            resetForm();
            onClose();
        } catch (error) {
            toast.error('Failed to add issue');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: '',
            status: 'Open',
            model: '',
            workflow: '',
            executionLogLink: '',
            issueSummary: '',
            fix: '',
        });
        setScreenshots([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Issue</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="input"
                                placeholder="Enter issue title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="input"
                                placeholder="e.g., Workflow, API, Feature"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="input"
                            >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Model
                            </label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                className="input"
                                placeholder="AI model name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Workflow
                            </label>
                            <input
                                type="text"
                                value={formData.workflow}
                                onChange={(e) => setFormData({ ...formData, workflow: e.target.value })}
                                className="input"
                                placeholder="Workflow name"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Execution Log Link
                            </label>
                            <input
                                type="url"
                                value={formData.executionLogLink}
                                onChange={(e) => setFormData({ ...formData, executionLogLink: e.target.value })}
                                className="input"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Issue Summary (AI Conversation)
                            </label>
                            <textarea
                                value={formData.issueSummary}
                                onChange={(e) => setFormData({ ...formData, issueSummary: e.target.value })}
                                className="input min-h-[100px] resize-y"
                                placeholder="Paste AI conversation logs or issue details..."
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fix / Resolution
                            </label>
                            <textarea
                                value={formData.fix}
                                onChange={(e) => setFormData({ ...formData, fix: e.target.value })}
                                className="input min-h-[80px] resize-y"
                                placeholder="How was this issue resolved?"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Screenshots
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="screenshot-upload"
                                />
                                <label htmlFor="screenshot-upload" className="cursor-pointer">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">
                                        Click to upload screenshots
                                    </p>
                                    {screenshots.length > 0 && (
                                        <p className="text-xs text-purple-600 mt-2">
                                            {screenshots.length} file(s) selected
                                        </p>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
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
                            {loading ? 'Adding...' : 'Add Issue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
