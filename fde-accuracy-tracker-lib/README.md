# @fde/accuracy-tracker

A reusable library for tracking AI/Agent accuracy issues across multiple customers. Built with React, TypeScript, Zustand, and Firebase.

## Features

- 📂 **Customer-Centric Organization**: Manage isolated workspaces for each customer
- 📝 **Detailed Issue Tracking**: Track model, workflow, execution logs, and fixes
- 📸 **Screenshot Gallery**: Visual browsing of issues with image gallery
- 📊 **Insights Dashboard**: Real-time analytics on issue categories and trends
- ⚡ **Demo Mode**: Built-in offline mode for exploration without backend

## Installation

```bash
npm install @fde/accuracy-tracker
# or
yarn add @fde/accuracy-tracker
# or
pnpm add @fde/accuracy-tracker
```

### Peer Dependencies

This library requires the following peer dependencies to be installed in your project:

```bash
npm install react react-dom firebase zustand react-router-dom lucide-react recharts react-hot-toast
```

## Quick Start

### 1. Initialize Firebase

First, initialize Firebase with your configuration:

```tsx
import { initializeFirebase } from '@fde/accuracy-tracker';

initializeFirebase({
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
});
```

### 2. Set Up Routing

Use React Router to set up your application routes:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  Layout, 
  Dashboard, 
  Tracker, 
  Gallery, 
  Insights 
} from '@fde/accuracy-tracker';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tracker" element={<Tracker />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="insights" element={<Insights />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### 3. Add TailwindCSS (Required)

This library uses TailwindCSS for styling. Make sure you have TailwindCSS installed and configured in your project.

**Install TailwindCSS:**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configure `tailwind.config.js`:**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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

## API Reference

### Components

#### Layout
Main layout component with navigation sidebar.

```tsx
import { Layout } from '@fde/accuracy-tracker';

<Layout />
```

#### Tracker
Issue tracking page with detailed table view.

```tsx
import { Tracker } from '@fde/accuracy-tracker';

<Tracker />
```

#### Gallery
Screenshot gallery view for visual issue browsing.

```tsx
import { Gallery } from '@fde/accuracy-tracker';

<Gallery />
```

#### Insights
Analytics dashboard with charts and metrics.

```tsx
import { Insights } from '@fde/accuracy-tracker';

<Insights />
```

#### CustomerSelector
Dropdown to select active customer workspace.

```tsx
import { CustomerSelector } from '@fde/accuracy-tracker';

<CustomerSelector />
```

### Hooks

#### useStore
Zustand store hook for accessing application state.

```tsx
import { useStore } from '@fde/accuracy-tracker';

function MyComponent() {
  const { user, customers, issues, setUser } = useStore();
  
  // Use state...
}
```

### Types

All TypeScript types are exported for use in your application:

```tsx
import type { 
  Issue, 
  Customer, 
  Screenshot, 
  User, 
  StatusType,
  IssueFilters 
} from '@fde/accuracy-tracker';
```

### Firebase Utilities

#### initializeFirebase
Initialize Firebase with your configuration.

```tsx
import { initializeFirebase } from '@fde/accuracy-tracker';

const services = initializeFirebase(firebaseConfig);
// Returns: { app, auth, db, storage }
```

#### getFirebaseServices
Get the initialized Firebase services.

```tsx
import { getFirebaseServices } from '@fde/accuracy-tracker';

const { auth, db, storage } = getFirebaseServices();
```

## Demo Mode

The library automatically falls back to demo mode if Firebase initialization fails. This allows you to explore features without backend configuration.

## License

MIT

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/yourusername/fde-accuracy-tracker).
