import { useState } from 'react';
import type { Issue } from '../types';
import { ChevronDown, ChevronRight, Plus, Filter, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import IssueDetailPanel from '../components/IssueDetailPanel';
import AddIssueModal from '../components/modals/AddIssueModal';

export default function Tracker() {
    const { issues, selectedCustomerId, customers, selectedIssue, setSelectedIssue } = useStore();
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [isAddIssueOpen, setIsAddIssueOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

    const filteredIssues = issues.filter(issue => {
        if (selectedCustomerId && issue.customerId !== selectedCustomerId) return false;
        if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
        if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
        return true;
    });

    const toggleRow = (issueId: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(issueId)) {
            newExpanded.delete(issueId);
        } else {
            newExpanded.add(issueId);
        }
        setExpandedRows(newExpanded);
    };

    const categories = Array.from(new Set(issues.map(i => i.category))).filter(Boolean);

    return (
        <div className="flex h-full">
            <div className={`flex-1 transition-all duration-300 ${selectedIssue ? 'mr-96' : ''}`}>
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Tracker</h1>
                                {selectedCustomer && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Viewing issues for <span className="font-medium">{selectedCustomer.name}</span>
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setIsAddIssueOpen(true)}
                                className="btn-primary flex items-center gap-2"
                                disabled={!selectedCustomerId}
                            >
                                <Plus className="w-4 h-4" />
                                Add Record
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search issues..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input pl-10"
                                />
                            </div>

                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="input w-48"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="input w-40"
                            >
                                <option value="all">All Status</option>
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    {!selectedCustomerId ? (
                        <div className="card text-center py-12">
                            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Please select a customer to view issues</p>
                        </div>
                    ) : filteredIssues.length === 0 ? (
                        <div className="card text-center py-12">
                            <p className="text-gray-600">No issues found</p>
                        </div>
                    ) : (
                        <div className="card overflow-hidden p-0">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="w-12 px-4 py-3"></th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Test</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Screenshot</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Execution Log Link</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Fix</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredIssues.map((issue) => (
                                        <tr
                                            key={issue.id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => setSelectedIssue(issue)}
                                        >
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleRow(issue.id);
                                                    }}
                                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                >
                                                    {expandedRows.has(issue.id) ? (
                                                        <ChevronDown className="w-4 h-4 text-gray-600" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4 text-gray-600" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-900">{issue.title}</span>
                                                    {issue.category && (
                                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                            {issue.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`status-badge ${issue.status === 'Open' ? 'status-open' :
                                                    issue.status === 'In Progress' ? 'status-in-progress' :
                                                        'status-resolved'
                                                    }`}>
                                                    {issue.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {issue.screenshots.length > 0 && (
                                                    <img
                                                        src={issue.screenshots[0].url}
                                                        alt="Screenshot"
                                                        className="w-10 h-10 object-cover rounded border border-gray-200"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {issue.executionLogLink && (
                                                    <a
                                                        href={issue.executionLogLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                                                    >
                                                        View Log
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-700">
                                                    {issue.fix || '–'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <IssueDetailPanel
                issue={selectedIssue}
                onClose={() => setSelectedIssue(null)}
            />

            <AddIssueModal
                isOpen={isAddIssueOpen}
                onClose={() => setIsAddIssueOpen(false)}
            />
        </div>
    );
}
