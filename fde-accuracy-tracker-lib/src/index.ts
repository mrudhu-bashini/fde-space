/**
 * @fde/accuracy-tracker
 * 
 * A reusable library for tracking AI/Agent accuracy issues across multiple customers.
 * Built with React, TypeScript, Zustand, and Firebase.
 * 
 * @example
 * ```tsx
 * import { 
 *   useStore, 
 *   Tracker, 
 *   initializeFirebase 
 * } from '@fde/accuracy-tracker';
 * 
 * // Initialize Firebase first
 * initializeFirebase({
 *   apiKey: "your-api-key",
 *   authDomain: "your-auth-domain",
 *   // ... other config
 * });
 * 
 * // Use the tracker in your app
 * function App() {
 *   return <Tracker />;
 * }
 * ```
 */

// Export types
export type {
    Screenshot,
    Issue,
    Customer,
    User,
    StatusType,
    IssueFilters,
} from './types';

// Export store
export { useStore } from './store/useStore';

// Export Firebase utilities
export {
    initializeFirebase,
    getFirebaseServices,
    auth,
    db,
    storage,
} from './lib/firebase';

// Export components
export {
    CustomerSelector,
    IssueDetailPanel,
    Layout,
    Sidebar,
    AddCustomerModal,
    AddIssueModal,
} from './components';

// Export pages
export {
    Dashboard,
    Gallery,
    Insights,
    Login,
    Tracker,
} from './pages';
