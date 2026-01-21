# Usage Example: Integrating FDE Accuracy Tracker Library

This guide shows you how to integrate the `@fde/accuracy-tracker` library into your React application.

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A React 18+ project (or create a new one with Vite)
- Firebase project with Firestore and Storage enabled

## Step 1: Install Dependencies

```bash
npm install @fde/accuracy-tracker

# Install peer dependencies
npm install react react-dom firebase zustand react-router-dom lucide-react recharts react-hot-toast

# Install TailwindCSS (if not already installed)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Step 2: Configure TailwindCSS

Update your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Include library components
    "./node_modules/@fde/accuracy-tracker/dist/**/*.{js,mjs}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
    },
  },
  plugins: [],
}
```

Add TailwindCSS directives to your `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Step 3: Set Up Firebase

Create a `.env` file in your project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 4: Initialize Firebase in Your App

Create `src/config/firebase.ts`:

```typescript
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

## Step 5: Create Your Main App Component

Update `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
  initializeFirebase,
  Layout, 
  Dashboard, 
  Tracker, 
  Gallery, 
  Insights,
  Login
} from '@fde/accuracy-tracker';
import { firebaseConfig } from './config/firebase';
import { Toaster } from 'react-hot-toast';

// Initialize Firebase
initializeFirebase(firebaseConfig);

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tracker" element={<Tracker />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="insights" element={<Insights />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
```

## Step 6: Update Your Main Entry File

Update `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## Step 7: Run Your Application

```bash
npm run dev
```

Your application should now be running with the FDE Accuracy Tracker integrated!

## Advanced: Using Individual Components

If you want to use only specific components:

```tsx
import { CustomerSelector, useStore } from '@fde/accuracy-tracker';
import type { Customer } from '@fde/accuracy-tracker';

function MyCustomPage() {
  const { selectedCustomerId, customers } = useStore();
  
  return (
    <div>
      <h1>My Custom Tracker Page</h1>
      <CustomerSelector />
      {/* Your custom UI */}
    </div>
  );
}
```

## Firebase Firestore Structure

The library expects the following Firestore structure:

```
customers/
  {customerId}/
    name: string
    createdDate: number
    issueCount: number

issues/
  {issueId}/
    customerId: string
    customerName: string
    title: string
    category: string
    status: 'Open' | 'In Progress' | 'Resolved'
    model?: string
    workflow?: string
    executionLogLink?: string
    screenshots: Screenshot[]
    issueSummary?: string
    fix?: string
    dateAdded: number
    lastUpdated: number
    reportedBy: string

users/
  {userId}/
    email: string
    name: string
    role: 'PM' | 'FDE'
    createdAt: number
```

## Demo Mode

If Firebase is not configured or initialization fails, the app automatically runs in demo mode with sample data.

## Customization

You can extend the library's components by:

1. Wrapping them in your own components
2. Using the `useStore` hook to access and manipulate state
3. Customizing TailwindCSS theme colors

## Troubleshooting

**Issue**: Components look unstyled
- **Solution**: Make sure TailwindCSS is properly configured and includes the library's dist folder in the content array

**Issue**: Firebase not initializing
- **Solution**: Check your `.env` file and ensure all Firebase credentials are correct

**Issue**: Type errors
- **Solution**: Make sure you're using TypeScript 5+ and have all peer dependencies installed
