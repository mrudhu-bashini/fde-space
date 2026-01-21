import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Insights() {
    const { issues, customers } = useStore();
    const [filterCustomerId, setFilterCustomerId] = useState<string>('all');

    const filteredIssues = useMemo(() => {
        if (filterCustomerId === 'all') return issues;
        return issues.filter(issue => issue.customerId === filterCustomerId);
    }, [issues, filterCustomerId]);

    // Calculate metrics
    const totalIssues = filteredIssues.length;
    const openIssues = filteredIssues.filter(i => i.status === 'Open').length;
    const inProgressIssues = filteredIssues.filter(i => i.status === 'In Progress').length;
    const resolvedIssues = filteredIssues.filter(i => i.status === 'Resolved').length;

    // Issues by Category
    const categoryData = useMemo(() => {
        const categories = filteredIssues.reduce((acc, issue) => {
            const cat = issue.category || 'Uncategorized';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categories).map(([name, value]) => ({ name, value }));
    }, [filteredIssues]);

    // Issues by Status
    const statusData = [
        { name: 'In Progress', value: inProgressIssues, color: '#06b6d4' },
    ];

    // Issues by Model
    const modelData = useMemo(() => {
        const models = filteredIssues.reduce((acc, issue) => {
            const model = issue.model || 'Unknown';
            acc[model] = (acc[model] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(models).map(([name, value]) => ({ name, value }));
    }, [filteredIssues]);

    // Issues by Workflow
    const workflowData = useMemo(() => {
        const workflows = filteredIssues.reduce((acc, issue) => {
            const workflow = issue.workflow || 'Unknown';
            acc[workflow] = (acc[workflow] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(workflows).map(([name, value]) => ({ name, value }));
    }, [filteredIssues]);

    // Issues over time
    const timelineData = useMemo(() => {
        const grouped = filteredIssues.reduce((acc, issue) => {
            const date = new Date(issue.dateAdded).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(grouped)
            .map(([date, count]) => ({ date, count }))
            .slice(-10); // Last 10 data points
    }, [filteredIssues]);



    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">AI/Agent Accuracy Issues Overview</h1>
                <p className="text-sm text-gray-600 mb-4">
                    Charts and summary metrics for all recorded AI/agent accuracy issues, including counts, category and status breakdowns, and model/workflow trends.
                </p>

                <div className="flex items-center gap-4">
                    <select
                        value={filterCustomerId}
                        onChange={(e) => setFilterCustomerId(e.target.value)}
                        className="input w-64"
                    >
                        <option value="all">All Customers</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-purple-50 to-white border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Total AI/Agent Accuracy Issues</h3>
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{totalIssues}</p>
                </div>

                <div className="card bg-gradient-to-br from-red-50 to-white border-red-200">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Open Issues</h3>
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{openIssues}</p>
                </div>

                <div className="card bg-gradient-to-br from-green-50 to-white border-green-200">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Resolved Issues</h3>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{resolvedIssues}</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Issues by Category */}
                <div className="card">
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-900">Issues by Category</h3>
                        <p className="text-xs text-gray-600 mt-1">
                            Visualize the count of issues for each category to highlight the most common issue types.
                        </p>
                    </div>
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 py-12">No data available</p>
                    )}
                </div>

                {/* Issues by Status */}
                <div className="card">
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-900">Issues by Status</h3>
                        <p className="text-xs text-gray-600 mt-1">
                            Distribution of issues across different states based on Status.
                        </p>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                            <span className="text-xs text-gray-600">In Progress</span>
                        </div>
                    </div>
                </div>

                {/* Issues Reported Over Time */}
                <div className="card">
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-900">Issues Reported Over Time</h3>
                        <p className="text-xs text-gray-600 mt-1">
                            Track the number of issues reported over time for trend analysis.
                        </p>
                    </div>
                    {timelineData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={timelineData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 py-12">No data available</p>
                    )}
                </div>

                {/* Issues by Model */}
                <div className="card">
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-900">Issues by Model</h3>
                        <p className="text-xs text-gray-600 mt-1">
                            Number of issues grouped by Model to identify model-specific trends.
                        </p>
                    </div>
                    {modelData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={modelData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 py-12">No data available</p>
                    )}
                </div>

                {/* Issues by Workflow */}
                <div className="card lg:col-span-2">
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-900">Issues by Workflow</h3>
                        <p className="text-xs text-gray-600 mt-1">
                            Count of issues grouped by workflow to identify workflows with the most issues.
                        </p>
                    </div>
                    {workflowData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={workflowData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 py-12">No data available</p>
                    )}
                </div>
            </div>
        </div>
    );
}
