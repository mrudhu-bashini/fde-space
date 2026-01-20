import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Issue } from '../types';
import { X, Calendar } from 'lucide-react';

export default function Gallery() {
    const { issues, selectedCustomerId } = useStore();
    const [selectedImage, setSelectedImage] = useState<{ url: string; issue: Issue } | null>(null);
    const [relatedIssueFilter, setRelatedIssueFilter] = useState<string>('all');

    // Get all screenshots with their related issues
    const screenshots = issues
        .filter(issue => selectedCustomerId ? issue.customerId === selectedCustomerId : true)
        .flatMap(issue =>
            issue.screenshots.map(screenshot => ({
                screenshot,
                issue
            }))
        )
        .filter(item =>
            relatedIssueFilter === 'all' || item.issue.id === relatedIssueFilter
        );

    const uniqueIssues = Array.from(new Set(issues.map(i => i.id)))
        .map(id => issues.find(i => i.id === id)!);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Screenshots Gallery</h1>
                <p className="text-sm text-gray-600">
                    Browse and review screenshots visually, each card showing screenshot details and the related accuracy issue for context.
                </p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex items-center gap-4">
                <select
                    value={relatedIssueFilter}
                    onChange={(e) => setRelatedIssueFilter(e.target.value)}
                    className="input w-64"
                >
                    <option value="all">All Issues</option>
                    {uniqueIssues.map(issue => (
                        <option key={issue.id} value={issue.id}>{issue.title}</option>
                    ))}
                </select>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{screenshots.length} screenshot(s)</span>
                </div>
            </div>

            {/* Gallery Grid */}
            {screenshots.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-600">No screenshots found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {screenshots.map((item, index) => (
                        <div
                            key={`${item.issue.id}-${item.screenshot.id}-${index}`}
                            className="card p-0 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                            onClick={() => setSelectedImage({ url: item.screenshot.url, issue: item.issue })}
                        >
                            <div className="aspect-square overflow-hidden bg-gray-100">
                                <img
                                    src={item.screenshot.url}
                                    alt={item.screenshot.description}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {item.issue.title}
                                </h3>

                                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                    {item.screenshot.description}
                                </p>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Date Added</span>
                                        <span className="text-gray-700 font-medium">
                                            {new Date(item.screenshot.dateAdded).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Related Issue</span>
                                        <span className={`status-badge ${item.issue.status === 'Open' ? 'status-open' :
                                            item.issue.status === 'In Progress' ? 'status-in-progress' :
                                                'status-resolved'
                                            }`}>
                                            {item.issue.status}
                                        </span>
                                    </div>

                                    {item.issue.category && (
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">Issue Category</span>
                                            <span className="text-gray-700 font-medium">{item.issue.category}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    <div className="max-w-5xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedImage.url}
                            alt="Full size screenshot"
                            className="w-full h-auto rounded-lg"
                        />
                        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                            <h3 className="font-semibold mb-2">{selectedImage.issue.title}</h3>
                            <p className="text-sm text-gray-300">{selectedImage.issue.category}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
