import { X } from 'lucide-react';
import type { Issue } from '../types';

interface IssueDetailPanelProps {
    issue: Issue | null;
    onClose: () => void;
}

export default function IssueDetailPanel({ issue, onClose }: IssueDetailPanelProps) {
    if (!issue) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-2xl overflow-y-auto z-40 animate-slide-in">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">{issue.title}</h2>
                        <span className={`status-badge ${issue.status === 'Open' ? 'status-open' :
                            issue.status === 'In Progress' ? 'status-in-progress' :
                                'status-resolved'
                            }`}>
                            {issue.status}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Details Section */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Details</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Latest Status Change</label>
                            <p className="text-sm text-gray-900 mt-1">{issue.status}</p>
                        </div>

                        {issue.executionLogLink && (
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Execution Log Link</label>
                                <a
                                    href={issue.executionLogLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-purple-600 hover:text-purple-700 hover:underline mt-1 block break-all"
                                >
                                    {issue.executionLogLink.length > 50
                                        ? issue.executionLogLink.substring(0, 50) + '...'
                                        : issue.executionLogLink}
                                </a>
                            </div>
                        )}

                        {issue.category && (
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</label>
                                <p className="text-sm text-gray-900 mt-1">{issue.category}</p>
                            </div>
                        )}

                        {issue.model && (
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Model</label>
                                <p className="text-sm text-gray-900 mt-1">{issue.model}</p>
                            </div>
                        )}

                        {issue.workflow && (
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Workflow</label>
                                <p className="text-sm text-gray-900 mt-1">{issue.workflow}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Issue Summary (AI Conversation) */}
                {issue.issueSummary && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Issue Summary (AI)</h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                            {issue.issueSummary}
                        </div>
                    </div>
                )}

                {/* Screenshots */}
                {issue.screenshots.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Screenshots</h3>
                        <div className="space-y-3">
                            {issue.screenshots.map((screenshot) => (
                                <div key={screenshot.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <img
                                        src={screenshot.url}
                                        alt={screenshot.description}
                                        className="w-full h-48 object-cover"
                                    />
                                    {screenshot.description && (
                                        <div className="p-3 bg-gray-50">
                                            <p className="text-xs text-gray-600">{screenshot.description}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Fix Information */}
                {issue.fix && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Fix</h3>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-gray-700">
                            {issue.fix}
                        </div>
                    </div>
                )}

                {/* Metadata */}
                <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Reported by <span className="font-medium text-gray-700">{issue.reportedBy}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(issue.dateAdded).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
