export interface Screenshot {
    id: string;
    url: string;
    description: string;
    dateAdded: number;
}

export interface Issue {
    id: string;
    customerId: string;
    customerName: string;
    title: string;
    category: string;
    status: 'Open' | 'In Progress' | 'Resolved';
    model?: string;
    workflow?: string;
    executionLogLink?: string;
    screenshots: Screenshot[];
    issueSummary?: string;
    fix?: string;
    dateAdded: number;
    lastUpdated: number;
    reportedBy: string;
}

export interface Customer {
    id: string;
    name: string;
    createdDate: number;
    issueCount: number;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'PM' | 'FDE';
    createdAt: number;
}

export type StatusType = 'Open' | 'In Progress' | 'Resolved';

export interface IssueFilters {
    category?: string;
    status?: StatusType;
    customerId?: string;
}
