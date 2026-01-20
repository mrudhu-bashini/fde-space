import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Tracker from './pages/Tracker';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import Insights from './pages/Insights';

function App() {
  // Bypassing authentication for now - directly showing the app
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/tracker" />} />
          <Route path="tracker" element={<Tracker />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="insights" element={<Insights />} />
        </Route>
        <Route path="*" element={<Navigate to="/tracker" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
