import { create } from 'zustand';
import type { User, Issue, Customer } from '../types';

interface AppState {
    user: User | null;
    selectedCustomerId: string | null;
    selectedIssue: Issue | null;
    customers: Customer[];
    issues: Issue[];
    setUser: (user: User | null) => void;
    setSelectedCustomerId: (id: string | null) => void;
    setSelectedIssue: (issue: Issue | null) => void;
    setCustomers: (customers: Customer[]) => void;
    setIssues: (issues: Issue[]) => void;
}

export const useStore = create<AppState>((set) => ({
    user: null,
    selectedCustomerId: null,
    selectedIssue: null,
    customers: [],
    issues: [],
    setUser: (user) => set({ user }),
    setSelectedCustomerId: (id) => set({ selectedCustomerId: id }),
    setSelectedIssue: (issue) => set({ selectedIssue: issue }),
    setCustomers: (customers) => set({ customers }),
    setIssues: (issues) => set({ issues }),
}));
